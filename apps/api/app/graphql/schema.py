"""Strawberry GraphQL schema"""

from datetime import date, datetime
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
    createdAt: datetime

    @classmethod
    def from_model(cls, user_model):
        """Create User GraphQL type from SQLAlchemy model"""
        return cls(
            id=str(user_model.id),
            email=user_model.email,
            createdAt=user_model.createdAt,
        )


@strawberry.type
class Task:
    """Task GraphQL type"""

    id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    dueDate: Optional[date]
    userId: str
    createdAt: datetime
    updatedAt: datetime

    @classmethod
    def from_model(cls, task_model):
        """Create Task GraphQL type from SQLAlchemy model"""
        return cls(
            id=str(task_model.id),
            title=task_model.title,
            description=task_model.description,
            status=task_model.status.value,
            priority=task_model.priority.value,
            dueDate=task_model.dueDate,
            userId=str(task_model.userId),
            createdAt=task_model.createdAt,
            updatedAt=task_model.updatedAt,
        )


@strawberry.type
class TasksConnection:
    """Paginated tasks response with metadata"""

    tasks: List[Task]
    total: int
    limit: int
    offset: int
    has_more: bool


@strawberry.input
class CreateTaskInput:
    """Input for creating a task"""

    title: str
    description: Optional[str] = None
    status: Optional[str] = None  # Defaults to "todo"
    priority: Optional[str] = None  # Defaults to "medium"
    dueDate: Optional[date] = None


@strawberry.input
class UpdateTaskInput:
    """Input for updating a task"""

    id: str
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    dueDate: Optional[date] = None


@strawberry.input
class TaskFilters:
    """Filters for task queries"""

    status: Optional[str] = None
    priority: Optional[str] = None
    dueDate_from: Optional[date] = None
    dueDate_to: Optional[date] = None
    search: Optional[str] = None


@strawberry.type
class Query:
    """GraphQL Query type"""

    @strawberry.field
    async def tasks(
        self,
        info: Info[GraphQLContext, None],
        filters: Optional[TaskFilters] = None,
        sort_by: str = "createdAt",
        sort_order: str = "desc",
        limit: int = 50,
        offset: int = 0,
    ) -> List[Task]:
        """Get tasks with filtering, sorting, and pagination"""

        from app.models.task import TaskPriority, TaskStatus
        from app.services.task_service import get_tasks

        # Require authentication
        user = await info.context.require_user()

        # Parse filters
        status = None
        if filters and filters.status:
            try:
                status = TaskStatus(filters.status)
            except ValueError:
                raise ValueError(f"Invalid status: {filters.status}")

        priority = None
        if filters and filters.priority:
            try:
                priority = TaskPriority(filters.priority)
            except ValueError:
                raise ValueError(f"Invalid priority: {filters.priority}")

        # Get tasks
        db = await info.context.get_db()
        tasks = await get_tasks(
            db=db,
            userId=user.id,
            status=status,
            priority=priority,
            dueDate_from=filters.dueDate_from if filters else None,
            dueDate_to=filters.dueDate_to if filters else None,
            search=filters.search if filters else None,
            sort_by=sort_by,
            sort_order=sort_order,
            limit=min(limit, 100),  # Cap at 100
            offset=max(offset, 0),
        )

        return [Task.from_model(task) for task in tasks]

    @strawberry.field
    async def task(self, id: str, info: Info[GraphQLContext, None]) -> Optional[Task]:
        """Get task by ID"""
        from uuid import UUID

        from app.services.task_service import get_task_by_id

        # Require authentication
        user = await info.context.require_user()

        # Validate input
        if not id or not id.strip():
            return None

        try:
            task_id = UUID(id)
        except ValueError:
            return None

        # Get task (with user authorization check)
        db = await info.context.get_db()
        task = await get_task_by_id(db, task_id, userId=user.id)

        if not task:
            return None

        return Task.from_model(task)

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
            userId = UUID(id)
        except ValueError:
            return None

        db = await info.context.get_db()
        user = await get_user_by_id(db, userId)
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
        stmt = select(UserModel).order_by(UserModel.createdAt.desc())
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
    async def create_task(self, input: CreateTaskInput, info: Info[GraphQLContext, None]) -> Task:
        """Create a new task"""
        from app.models.task import TaskPriority, TaskStatus
        from app.services.task_service import create_task

        # Require authentication
        user = await info.context.require_user()

        # Parse status and priority
        status = TaskStatus.TODO
        if input.status:
            try:
                status = TaskStatus(input.status)
            except ValueError:
                raise ValueError(f"Invalid status: {input.status}")

        priority = TaskPriority.MEDIUM
        if input.priority:
            try:
                priority = TaskPriority(input.priority)
            except ValueError:
                raise ValueError(f"Invalid priority: {input.priority}")

        # Create task
        db = await info.context.get_db()
        task = await create_task(
            db=db,
            userId=user.id,
            title=input.title,
            description=input.description,
            status=status,
            priority=priority,
            dueDate=input.dueDate,
        )

        return Task.from_model(task)

    @strawberry.mutation
    async def update_task(
        self, input: UpdateTaskInput, info: Info[GraphQLContext, None]
    ) -> Optional[Task]:
        """Update a task"""
        from uuid import UUID

        from app.models.task import TaskPriority, TaskStatus
        from app.services.task_service import update_task

        # Require authentication
        user = await info.context.require_user()

        # Validate input
        if not input.id or not input.id.strip():
            raise ValueError("Task ID is required")

        try:
            task_id = UUID(input.id)
        except ValueError:
            raise ValueError("Invalid task ID format")

        # Parse status and priority if provided
        status = None
        if input.status:
            try:
                status = TaskStatus(input.status)
            except ValueError:
                raise ValueError(f"Invalid status: {input.status}")

        priority = None
        if input.priority:
            try:
                priority = TaskPriority(input.priority)
            except ValueError:
                raise ValueError(f"Invalid priority: {input.priority}")

        # Update task
        db = await info.context.get_db()
        task = await update_task(
            db=db,
            task_id=task_id,
            userId=user.id,
            title=input.title,
            description=input.description,
            status=status,
            priority=priority,
            dueDate=input.dueDate,
        )

        if not task:
            return None

        return Task.from_model(task)

    @strawberry.mutation
    async def delete_task(self, id: str, info: Info[GraphQLContext, None]) -> bool:
        """Delete a task"""
        from uuid import UUID

        from app.services.task_service import delete_task

        # Require authentication
        user = await info.context.require_user()

        # Validate input
        if not id or not id.strip():
            raise ValueError("Task ID is required")

        try:
            task_id = UUID(id)
        except ValueError:
            raise ValueError("Invalid task ID format")

        # Delete task
        db = await info.context.get_db()
        deleted = await delete_task(db, task_id, userId=user.id)

        return deleted

    @strawberry.mutation
    async def register(
        self,
        input: RegisterInput,
        info: Info[GraphQLContext, None],
    ) -> AuthPayload:
        """Register a new user"""
        import structlog

        from app.auth.jwt import create_auth_tokens_for_user
        from app.core.validation import validate_email, validate_password
        from app.services.user_service import create_user

        logger = structlog.get_logger(__name__)

        # Validate email format
        from app.core.exceptions import ValidationError

        if not validate_email(input.email):
            logger.warning("Registration attempt with invalid email", email=input.email)
            raise ValidationError("Invalid email format")

        # Validate password strength
        is_valid, errors = validate_password(input.password)
        if not is_valid:
            logger.warning(
                "Registration attempt with weak password", email=input.email, errors=errors
            )
            raise ValidationError("; ".join(errors))

        # Create user
        db = await info.context.get_db()
        try:
            user = await create_user(db, input.email, input.password)
            logger.info("User registered successfully", userId=str(user.id), email=input.email)
        except ValueError as e:
            # User already exists or other validation error
            from app.core.exceptions import ValidationError

            logger.warning("Registration attempt failed", email=input.email, error=str(e))
            raise ValidationError(str(e)) from e

        # Create tokens and store refresh token

        access_token, refresh_token = await create_auth_tokens_for_user(str(user.id), user.email)

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
        import structlog

        from app.core.exceptions import AuthenticationError
        from app.services.user_service import get_user_by_email, verify_password

        logger = structlog.get_logger(__name__)

        # Get user from database
        db = await info.context.get_db()
        user = await get_user_by_email(db, input.email)
        if not user:
            logger.warning("Login attempt with non-existent email", email=input.email)
            raise AuthenticationError("Incorrect email or password")

        # Verify password
        if not verify_password(input.password, user.password_hash):
            logger.warning(
                "Login attempt with incorrect password", email=input.email, userId=str(user.id)
            )
            raise AuthenticationError("Incorrect email or password")

        logger.info("User logged in successfully", userId=str(user.id), email=input.email)

        # Create tokens and store refresh token
        from app.auth.jwt import create_auth_tokens_for_user

        access_token, refresh_token = await create_auth_tokens_for_user(str(user.id), user.email)

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

        import structlog

        from app.auth.jwt import verify_token
        from app.cache import delete_refresh_token, get_refresh_token, is_token_revoked
        from app.core.exceptions import AuthenticationError
        from app.services.user_service import get_user_by_id

        logger = structlog.get_logger(__name__)

        # Rate limiting: 10 attempts per minute per IP
        # Note: GraphQL doesn't have direct access to request.app.state
        # We'll implement rate limiting via Redis in the cache layer if needed
        # For now, we rely on the REST endpoint rate limiting

        # Verify refresh token
        if not input.refresh_token:
            logger.warning("Refresh token mutation called without token")
            raise ValueError("Refresh token is required")

        payload = verify_token(input.refresh_token, token_type="refresh")

        # Validate payload
        userId_str = payload.get("sub")
        email = payload.get("email")

        if not userId_str or not email:
            raise AuthenticationError("Invalid token payload")

        # Check if token is revoked
        if await is_token_revoked(userId_str, input.refresh_token):
            logger.warning("Refresh token revoked", userId=userId_str)
            raise AuthenticationError("Token has been revoked")

        # Verify token exists in Redis
        stored_token = await get_refresh_token(userId_str, input.refresh_token)
        if not stored_token:
            logger.warning("Invalid refresh token", userId=userId_str)
            raise AuthenticationError("Invalid refresh token")

        # Token rotation: Delete old refresh token
        await delete_refresh_token(userId_str, input.refresh_token)

        # Get user from database
        userId = UUID(userId_str)
        db = await info.context.get_db()
        user = await get_user_by_id(db, userId)
        if not user:
            logger.warning("User not found during token refresh", userId=userId_str)
            raise AuthenticationError("User not found")

        logger.info("Token refreshed successfully", userId=userId_str, email=email)

        # Create new tokens and store refresh token
        from app.auth.jwt import create_auth_tokens_for_user

        access_token, new_refresh_token = await create_auth_tokens_for_user(userId_str, email)

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

        # Verify token to get userId
        try:
            payload = verify_token_safe(input.refresh_token, token_type="refresh")
            userId = payload.get("sub")

            if userId:
                # Revoke the refresh token
                await revoke_refresh_token(
                    userId,
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
