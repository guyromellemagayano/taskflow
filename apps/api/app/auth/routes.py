"""Authentication routes"""

import structlog
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt import create_access_token, create_refresh_token, verify_token
from app.cache import (
    delete_refresh_token,
    get_refresh_token,
    is_token_revoked,
    revoke_refresh_token,
    store_refresh_token,
)
from app.core.config import settings
from app.database import get_db
from app.schemas.auth import LoginRequest, RefreshTokenRequest, TokenResponse
from app.services.user_service import get_user_by_email, verify_password

router = APIRouter()
logger = structlog.get_logger(__name__)


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Login endpoint - authenticate user and return JWT tokens"""
    # Rate limiting: 5 attempts per minute per IP
    try:
        limiter = request.app.state.limiter
        limiter.limit("5/minute", key_func=get_remote_address)(lambda: None)()
    except Exception:
        pass  # Continue if rate limiting fails

    # Get user from database
    user = await get_user_by_email(db, credentials.email)
    if not user:
        logger.warning("Login attempt with non-existent email", email=credentials.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        logger.warning(
            "Login attempt with incorrect password", email=credentials.email, user_id=str(user.id)
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    logger.info("User logged in successfully", user_id=str(user.id), email=credentials.email)

    # Create tokens
    token_data = {
        "sub": str(user.id),
        "email": user.email,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Store refresh token in Redis
    await store_refresh_token(
        str(user.id),
        refresh_token,
        expires_in_days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
    )

    # Set httpOnly cookies for tokens (more secure than localStorage)

    access_token_expires_seconds = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    refresh_token_expires_seconds = settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60

    response.set_cookie(
        key="taskflow_access_token",
        value=access_token,
        max_age=access_token_expires_seconds,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    response.set_cookie(
        key="taskflow_refresh_token",
        value=refresh_token,
        max_age=refresh_token_expires_seconds,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token_endpoint(
    request_data: RefreshTokenRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Refresh access token with rotation"""
    # Rate limiting: 10 attempts per minute per IP
    try:
        limiter = request.app.state.limiter
        limiter.limit("10/minute", key_func=get_remote_address)(lambda: None)()
    except Exception:
        pass  # Continue if rate limiting fails

    # Verify refresh token
    if not request_data.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required",
        )

    payload = verify_token(request_data.refresh_token, token_type="refresh")

    # Validate payload has required fields
    user_id = payload.get("sub")
    email = payload.get("email")

    if not user_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    # Check if token is revoked
    if await is_token_revoked(user_id, request_data.refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
        )

    # Verify token exists in Redis
    stored_token = await get_refresh_token(user_id, request_data.refresh_token)
    if not stored_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    # Token rotation: Delete old refresh token
    await delete_refresh_token(user_id, request_data.refresh_token)

    # Create new tokens
    token_data = {
        "sub": user_id,
        "email": email,
    }

    access_token = create_access_token(token_data)
    new_refresh_token = create_refresh_token(token_data)

    # Store new refresh token in Redis
    await store_refresh_token(
        user_id,
        new_refresh_token,
        expires_in_days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
    )

    # Set httpOnly cookies for new tokens

    access_token_expires_seconds = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    refresh_token_expires_seconds = settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60

    response.set_cookie(
        key="taskflow_access_token",
        value=access_token,
        max_age=access_token_expires_seconds,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    response.set_cookie(
        key="taskflow_refresh_token",
        value=new_refresh_token,
        max_age=refresh_token_expires_seconds,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
    )


@router.post("/logout")
async def logout(
    request_data: RefreshTokenRequest,
    request: Request,
    response: Response,
):
    """Logout endpoint - revoke refresh token"""
    if not request_data.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required",
        )

    # Verify token to get user_id
    try:
        payload = verify_token(request_data.refresh_token, token_type="refresh")
        user_id = payload.get("sub")

        if user_id:
            # Revoke the refresh token
            await revoke_refresh_token(
                user_id,
                request_data.refresh_token,
                expires_in_days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
            )
    except HTTPException:
        # If token is invalid, still return success (idempotent)
        pass

    # Clear cookies
    response.delete_cookie(key="taskflow_access_token", path="/")
    response.delete_cookie(key="taskflow_refresh_token", path="/")

    return {"message": "Logged out successfully"}
