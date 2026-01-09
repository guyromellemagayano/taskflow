"""GraphQL context for Strawberry"""

from typing import Optional

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import BaseContext

from app.models.user import User


class GraphQLContext(BaseContext):
    """GraphQL context with database session and optional user"""

    def __init__(self, request: Request):
        super().__init__()
        self.request = request
        self._db: Optional[AsyncSession] = None
        self._user: Optional[User] = None

    async def get_db(self) -> AsyncSession:
        """Get database session"""
        if self._db is None:
            # Create a new session for this request
            from app.database import AsyncSessionLocal

            self._db = AsyncSessionLocal()
        return self._db

    async def cleanup(self) -> None:
        """Cleanup resources (called after request)"""
        if self._db:
            try:
                # Rollback any uncommitted transactions
                await self._db.rollback()
            except Exception:
                pass  # Ignore rollback errors if session is already closed
            finally:
                await self._db.close()
                self._db = None

    async def get_user(self) -> Optional[User]:
        """Get current authenticated user from request"""
        if self._user is not None:
            return self._user

        # Try to get user from Authorization header
        auth_header = self.request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.replace("Bearer ", "")
        if not token:
            return None

        try:
            from uuid import UUID

            from app.auth.jwt import verify_token_safe
            from app.services.user_service import get_user_by_id

            payload = verify_token_safe(token)
            user_id_str = payload.get("sub")
            if not user_id_str:
                return None

            user_id = UUID(user_id_str)
            db = await self.get_db()
            self._user = await get_user_by_id(db, user_id)
            return self._user
        except Exception:
            return None

    async def require_user(self) -> User:
        """Require authenticated user, raise error if not authenticated"""
        from app.core.exceptions import AuthenticationError

        user = await self.get_user()
        if not user:
            raise AuthenticationError("Authentication required")
        return user


def get_context(request: Request) -> GraphQLContext:
    """Get GraphQL context from request"""
    return GraphQLContext(request)
