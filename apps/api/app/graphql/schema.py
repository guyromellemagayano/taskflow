"""Strawberry GraphQL schema"""

from datetime import UTC, date, datetime
from typing import List, Optional

import strawberry
from strawberry.types import Info

from app.graphql.context import GraphQLContext

# Phase 1: Basic GraphQL types and stub resolvers
# Phase 2: Will add actual database queries


@strawberry.type
class User:
    """User GraphQL type"""

    id: str
    email: str
    created_at: datetime

    @classmethod
    def from_model(cls, user_model):
        """Create User GraphQL type from SQLAlchemy model"""
        return cls(
            id=str(user_model.id),
            email=user_model.email,
            created_at=user_model.created_at,
        )


@strawberry.type
class Task:
    """Task GraphQL type"""

    id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[date]
    user_id: str
    created_at: datetime
    updated_at: datetime


@strawberry.type
class Query:
    """GraphQL Query type"""

    @strawberry.field
    async def tasks(self) -> List[Task]:
        """Get all tasks (Phase 1: returns empty list)"""
        # Phase 1: Stub - returns empty list
        # Phase 2: Will query database
        return []

    @strawberry.field
    async def task(self, id: str) -> Optional[Task]:
        """Get task by ID (Phase 1: returns None)"""
        # Phase 1: Stub - returns None
        # Phase 2: Will query database

        # Validate input
        if not id or not id.strip():
            return None

        return None

    @strawberry.field
    async def me(self, info: Info[GraphQLContext, None]) -> Optional[User]:
        """Get current authenticated user"""
        user = await info.context.get_user()
        if not user:
            return None
        return User.from_model(user)

    @strawberry.field
    async def user(self, id: str, info: Info[GraphQLContext, None]) -> Optional[User]:
        """Get user by ID"""
        from uuid import UUID

        from app.services.user_service import get_user_by_id

        try:
            user_id = UUID(id)
        except ValueError:
            return None

        db = await info.context.get_db()
        user = await get_user_by_id(db, user_id)
        if not user:
            return None

        return User.from_model(user)

    @strawberry.field
    async def users(self, info: Info[GraphQLContext, None]) -> List[User]:
        """Get all users (requires authentication)"""
        from sqlalchemy import select

        from app.models.user import User as UserModel

        # Require authentication
        await info.context.require_user()

        # Query database directly
        db = await info.context.get_db()
        stmt = select(UserModel).order_by(UserModel.created_at.desc())
        result = await db.execute(stmt)
        users = result.scalars().all()

        return [User.from_model(user) for user in users]


@strawberry.input
class RegisterInput:
    """Input for user registration"""

    email: str
    password: str


@strawberry.input
class LoginInput:
    """Input for user login"""

    email: str
    password: str


@strawberry.input
class RefreshTokenInput:
    """Input for token refresh"""

    refresh_token: str


@strawberry.type
class AuthPayload:
    """Authentication response payload"""

    access_token: str
    refresh_token: str
    user: User


@strawberry.type
class Mutation:
    """GraphQL Mutation type"""

    @strawberry.mutation
    async def create_task(
        self,
        title: str,
        description: Optional[str] = None,
        priority: str = "medium",
        due_date: Optional[date] = None,
    ) -> Task:
        """Create a new task (Phase 1: returns stub)"""
        # Phase 1: Stub - returns mock task
        # Phase 2: Will create in database

        # Validate input
        if not title or not title.strip():
            raise ValueError("Title is required")

        # Validate priority
        valid_priorities = ["low", "medium", "high"]
        if priority not in valid_priorities:
            raise ValueError(f"Priority must be one of: {', '.join(valid_priorities)}")

        import uuid
        from datetime import datetime

        return Task(
            id=str(uuid.uuid4()),
            title=title.strip(),
            description=description.strip() if description else None,
            status="todo",
            priority=priority,
            due_date=due_date,
            user_id=str(uuid.uuid4()),  # Phase 2: Will use authenticated user
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    @strawberry.mutation
    async def update_task(
        self,
        id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
    ) -> Optional[Task]:
        """Update a task (Phase 1: returns None)"""
        # Phase 1: Stub - returns None
        # Phase 2: Will update in database

        # Validate input
        if not id or not id.strip():
            raise ValueError("Task ID is required")

        # Validate status if provided
        if status is not None:
            valid_statuses = ["todo", "in_progress", "done"]
            if status not in valid_statuses:
                raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")

        # Validate priority if provided
        if priority is not None:
            valid_priorities = ["low", "medium", "high"]
            if priority not in valid_priorities:
                raise ValueError(f"Priority must be one of: {', '.join(valid_priorities)}")

        return None

    @strawberry.mutation
    async def delete_task(self, id: str) -> bool:
        """Delete a task (Phase 1: returns False)"""
        # Phase 1: Stub - returns False
        # Phase 2: Will delete from database

        # Validate input
        if not id or not id.strip():
            raise ValueError("Task ID is required")

        return False

    @strawberry.mutation
    async def register(
        self,
        input: RegisterInput,
        info: Info[GraphQLContext, None],
    ) -> AuthPayload:
        """Register a new user"""
        from app.auth.jwt import create_access_token, create_refresh_token
        from app.cache import store_refresh_token
        from app.core.config import settings
        from app.core.validation import validate_email, validate_password
        from app.services.user_service import create_user

        # Validate email format
        if not validate_email(input.email):
            raise ValueError("Invalid email format")

        # Validate password strength
        is_valid, errors = validate_password(input.password)
        if not is_valid:
            raise ValueError("; ".join(errors))

        # Create user
        db = await info.context.get_db()
        user = await create_user(db, input.email, input.password)

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

        return AuthPayload(
            access_token=access_token,
            refresh_token=refresh_token,
            user=User.from_model(user),
        )

    @strawberry.mutation
    async def login(
        self,
        input: LoginInput,
        info: Info[GraphQLContext, None],
    ) -> AuthPayload:
        """Login user and return JWT tokens"""
        from app.auth.jwt import create_access_token, create_refresh_token
        from app.cache import store_refresh_token
        from app.core.config import settings
        from app.core.exceptions import AuthenticationError
        from app.services.user_service import get_user_by_email, verify_password

        # Get user from database
        db = await info.context.get_db()
        user = await get_user_by_email(db, input.email)
        if not user:
            raise AuthenticationError("Incorrect email or password")

        # Verify password
        if not verify_password(input.password, user.password_hash):
            raise AuthenticationError("Incorrect email or password")

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

        return AuthPayload(
            access_token=access_token,
            refresh_token=refresh_token,
            user=User.from_model(user),
        )

    @strawberry.mutation
    async def refresh_token(
        self,
        input: RefreshTokenInput,
        info: Info[GraphQLContext, None],
    ) -> AuthPayload:
        """Refresh access token with rotation"""
        from uuid import UUID

        from app.auth.jwt import create_access_token, create_refresh_token, verify_token
        from app.cache import (
            delete_refresh_token,
            get_refresh_token,
            is_token_revoked,
            store_refresh_token,
        )
        from app.core.config import settings
        from app.core.exceptions import AuthenticationError
        from app.services.user_service import get_user_by_id

        # Verify refresh token
        if not input.refresh_token:
            raise ValueError("Refresh token is required")

        payload = verify_token(input.refresh_token, token_type="refresh")

        # Validate payload
        user_id_str = payload.get("sub")
        email = payload.get("email")

        if not user_id_str or not email:
            raise AuthenticationError("Invalid token payload")

        # Check if token is revoked
        if await is_token_revoked(user_id_str, input.refresh_token):
            raise AuthenticationError("Token has been revoked")

        # Verify token exists in Redis
        stored_token = await get_refresh_token(user_id_str, input.refresh_token)
        if not stored_token:
            raise AuthenticationError("Invalid refresh token")

        # Token rotation: Delete old refresh token
        await delete_refresh_token(user_id_str, input.refresh_token)

        # Get user from database
        user_id = UUID(user_id_str)
        db = await info.context.get_db()
        user = await get_user_by_id(db, user_id)
        if not user:
            raise AuthenticationError("User not found")

        # Create new tokens
        token_data = {
            "sub": user_id_str,
            "email": email,
        }

        access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)

        # Store new refresh token in Redis
        await store_refresh_token(
            user_id_str,
            new_refresh_token,
            expires_in_days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
        )

        return AuthPayload(
            access_token=access_token,
            refresh_token=new_refresh_token,
            user=User.from_model(user),
        )

    @strawberry.mutation
    async def logout(
        self,
        input: RefreshTokenInput,
        info: Info[GraphQLContext, None],
    ) -> bool:
        """Logout user and revoke refresh token"""
        from app.auth.jwt import verify_token_safe
        from app.cache import revoke_refresh_token
        from app.core.config import settings

        if not input.refresh_token:
            return False

        # Verify token to get user_id
        try:
            payload = verify_token_safe(input.refresh_token, token_type="refresh")
            user_id = payload.get("sub")

            if user_id:
                # Revoke the refresh token
                await revoke_refresh_token(
                    user_id,
                    input.refresh_token,
                    expires_in_days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
                )
                return True
        except Exception:
            # If token is invalid, still return success (idempotent)
            pass

        return False


# Create schema
schema = strawberry.Schema(query=Query, mutation=Mutation)
