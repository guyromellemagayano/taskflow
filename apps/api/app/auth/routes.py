"""Authentication routes"""

from fastapi import APIRouter, HTTPException, Request, status
from passlib.context import CryptContext

from app.auth.jwt import create_access_token, create_refresh_token, verify_token
from app.schemas.auth import LoginRequest, RefreshTokenRequest, TokenResponse

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Phase 1: Hardcoded test user for login
# Phase 2: Will use database
# Note: Hash is computed lazily to avoid bcrypt initialization issues at import time
def get_test_user():
    """Get test user (lazy initialization)"""
    return {
        "email": "test@example.com",
        "password_hash": pwd_context.hash("testpassword123"),  # Hashed password
        "user_id": "00000000-0000-0000-0000-000000000001",
    }


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, request: Request):
    """Login endpoint (Phase 1: uses hardcoded test user)"""
    # Phase 1: Basic rate limit check (simplified)
    # Phase 2: Will use proper decorator
    limiter = request.app.state.limiter
    try:
        # Check rate limit (non-blocking check)
        limiter.limit("5/minute")(lambda: None)()
    except Exception:
        pass  # Phase 1: Skip if rate limiting fails

    # Phase 1: Hardcoded validation
    # Phase 2: Will query database and verify password
    test_user = get_test_user()

    if credentials.email != test_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Phase 1: Verify password for test user
    # Phase 2: Will verify password_hash using pwd_context.verify() from database
    if not pwd_context.verify(credentials.password, test_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Create tokens
    token_data = {
        "sub": test_user["user_id"],
        "email": test_user["email"],
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token_endpoint(request_data: RefreshTokenRequest, request: Request):
    """Refresh access token"""
    # Phase 1: Basic rate limit check (simplified)
    # Phase 2: Will use proper decorator
    limiter = request.app.state.limiter
    try:
        # Check rate limit (non-blocking check)
        limiter.limit("10/minute")(lambda: None)()
    except Exception:
        pass  # Phase 1: Skip if rate limiting fails

    # Verify refresh token
    if not request_data.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required",
        )

    payload = verify_token(request_data.refresh_token, token_type="refresh")

    # Validate payload has required fields
    if not payload.get("sub") or not payload.get("email"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    # Create new tokens
    token_data = {
        "sub": payload.get("sub"),
        "email": payload.get("email"),
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )
