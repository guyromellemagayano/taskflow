"""GraphQL context for Strawberry"""

from typing import Optional

from fastapi import Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import BaseContext

from app.auth.cookies import (
    clear_auth_cookies,
    get_access_token_cookie,
    get_refresh_token_cookie,
    set_auth_cookies,
)
from app.models.user import User


class GraphQLContext(BaseContext):
    """GraphQL context with database session and optional user"""

    def __init__(self, request: Request, response: Response):
        super().__init__()
        self.request = request
        self.response = response
        self._db: Optional[AsyncSession] = None
        self._user: Optional[User] = None

    def get_refresh_token_cookie(self) -> Optional[str]:
        """Read the refresh-token cookie for GraphQL auth mutations."""
        return get_refresh_token_cookie(self.request)

    def set_auth_cookies(self, access_token: str, refresh_token: str) -> None:
        """Set auth cookies on the current GraphQL response."""
        set_auth_cookies(self.response, access_token, refresh_token)

    def clear_auth_cookies(self) -> None:
        """Clear auth cookies on the current GraphQL response."""
        clear_auth_cookies(self.response)

    async def get_db(self) -> AsyncSession:
        """
        Get database session (lazy initialization)

        Note: Session is automatically cleaned up by Strawberry's BaseContext.cleanup()
        which is called after each GraphQL request completes.
        """
        if self._db is None:
            # Create a new session for this request
            from app.database import AsyncSessionLocal

            self._db = AsyncSessionLocal()
        return self._db

    async def cleanup(self) -> None:
        """
        Cleanup resources (called automatically by Strawberry after each request)

        This ensures database sessions are properly closed and transactions are rolled back.
        """
        if self._db:
            try:
                # Rollback any uncommitted transactions
                await self._db.rollback()
            except Exception as e:
                # Log but don't fail on cleanup errors
                import structlog

                logger = structlog.get_logger(__name__)
                logger.warning("Error during session rollback", error=str(e))
            finally:
                try:
                    await self._db.close()
                except Exception as e:
                    import structlog

                    logger = structlog.get_logger(__name__)
                    logger.warning("Error closing database session", error=str(e))
                finally:
                    self._db = None
                    self._user = None  # Clear cached user as well

    async def get_user(self) -> Optional[User]:
        """Get current authenticated user from request"""
        if self._user is not None:
            return self._user

        # Bearer tokens remain supported for non-browser clients and legacy
        # localStorage sessions. Browser sessions use httpOnly cookies.
        auth_header = self.request.headers.get("Authorization")
        token: Optional[str] = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
        if not token:
            token = get_access_token_cookie(self.request)
        if not token:
            return None

        try:
            from uuid import UUID

            from app.auth.jwt import verify_token_safe
            from app.services.user_service import get_user_by_id

            payload = verify_token_safe(token)
            userId_str = payload.get("sub")
            if not userId_str:
                return None

            userId = UUID(userId_str)
            db = await self.get_db()
            self._user = await get_user_by_id(db, userId)
            return self._user
        except Exception as e:
            # Log authentication errors for debugging but don't expose details
            import structlog

            logger = structlog.get_logger(__name__)
            logger.debug("Authentication error", error=str(e))
            return None

    async def require_user(self) -> User:
        """Require authenticated user, raise error if not authenticated"""
        from app.core.exceptions import AuthenticationError

        user = await self.get_user()
        if not user:
            raise AuthenticationError("Authentication required")
        return user


def get_context(request: Request, response: Response) -> GraphQLContext:
    """Get GraphQL context from request"""
    return GraphQLContext(request, response)
