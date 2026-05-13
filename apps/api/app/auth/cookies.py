"""Shared auth cookie helpers."""

from fastapi import Request, Response

from app.core.config import settings

ACCESS_TOKEN_COOKIE = "taskflow_access_token"
REFRESH_TOKEN_COOKIE = "taskflow_refresh_token"


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    """Set browser auth cookies for access and refresh tokens."""
    access_token_expires_seconds = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    refresh_token_expires_seconds = settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60

    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=access_token,
        max_age=access_token_expires_seconds,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    response.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=refresh_token,
        max_age=refresh_token_expires_seconds,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    """Clear browser auth cookies."""
    response.delete_cookie(key=ACCESS_TOKEN_COOKIE, path="/")
    response.delete_cookie(key=REFRESH_TOKEN_COOKIE, path="/")


def get_access_token_cookie(request: Request) -> str | None:
    """Read the browser access-token cookie when present."""
    return request.cookies.get(ACCESS_TOKEN_COOKIE)


def get_refresh_token_cookie(request: Request) -> str | None:
    """Read the browser refresh-token cookie when present."""
    return request.cookies.get(REFRESH_TOKEN_COOKIE)
