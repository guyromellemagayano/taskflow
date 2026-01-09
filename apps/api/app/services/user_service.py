"""User service for database operations"""

from typing import Optional
from uuid import UUID

import structlog
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

logger = structlog.get_logger(__name__)

# Password hashing context
# Using Argon2id (recommended variant) with reasonable defaults
# - time_cost: Number of iterations (higher = more secure but slower)
# - memory_cost: Memory usage in KB (higher = more secure but uses more RAM)
# - parallelism: Number of parallel threads
# Argon2 supports passwords up to 2^32-1 bytes (effectively unlimited)
# Including "bcrypt" in schemes allows verification of existing bcrypt hashes during migration
# New passwords will use Argon2 (first scheme in list)
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],  # Argon2 for new passwords, bcrypt for legacy verification
    deprecated="auto",
    argon2__type="id",  # Use Argon2id (recommended hybrid variant) - valid values: 'id', 'i', 'd'
    argon2__time_cost=2,  # 2 iterations (reasonable for most apps)
    argon2__memory_cost=65536,  # 64 MB (reasonable for most apps)
    argon2__parallelism=1,  # Single thread (adjust if needed)
)


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """
    Get user by email address

    Args:
        db: Database session
        email: User email address

    Returns:
        User object if found, None otherwise
    """
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    return user


async def get_user_by_id(db: AsyncSession, user_id: UUID) -> Optional[User]:
    """
    Get user by ID

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        User object if found, None otherwise
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    return user


async def create_user(db: AsyncSession, email: str, password: str) -> User:
    """
    Create a new user with hashed password

    Args:
        db: Database session
        email: User email address
        password: Plain text password (will be hashed)

    Returns:
        Created User object

    Raises:
        ValueError: If user with email already exists or password is invalid
    """
    # Check if user already exists
    existing_user = await get_user_by_email(db, email)
    if existing_user:
        raise ValueError(f"User with email {email} already exists")

    # Hash password (Argon2 supports passwords up to 2^32-1 bytes)
    password_hash = pwd_context.hash(password)

    # Create user
    user = User(email=email, password_hash=password_hash)
    db.add(user)
    await db.commit()
    await db.refresh(user)

    logger.info("User created", user_id=str(user.id), email=email)
    return user


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database

    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


async def update_user(db: AsyncSession, user_id: UUID, **kwargs) -> Optional[User]:
    """
    Update user information

    Args:
        db: Database session
        user_id: User UUID
        **kwargs: Fields to update (email, password_hash, etc.)

    Returns:
        Updated User object if found, None otherwise
    """
    user = await get_user_by_id(db, user_id)
    if not user:
        return None

    # Update fields
    for key, value in kwargs.items():
        if hasattr(user, key):
            setattr(user, key, value)

    await db.commit()
    await db.refresh(user)

    logger.info("User updated", user_id=str(user_id), fields=list(kwargs.keys()))
    return user


async def change_password(db: AsyncSession, user_id: UUID, new_password: str) -> bool:
    """
    Change user password

    Args:
        db: Database session
        user_id: User UUID
        new_password: New plain text password (will be hashed)

    Returns:
        True if password was changed, False if user not found
    """
    # Hash password (Argon2 supports passwords up to 2^32-1 bytes)
    password_hash = pwd_context.hash(new_password)
    user = await update_user(db, user_id, password_hash=password_hash)

    if user:
        logger.info("Password changed", user_id=str(user_id))
        return True

    return False
