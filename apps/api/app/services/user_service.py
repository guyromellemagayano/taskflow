"""User service for database operations"""

from typing import Optional
from uuid import UUID

import structlog
from argon2 import PasswordHasher
from argon2.exceptions import Argon2Error, InvalidHashError, VerifyMismatchError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

logger = structlog.get_logger(__name__)

# Password hashing context using Argon2id with explicit operational parameters.
password_hasher = PasswordHasher(
    time_cost=2,
    memory_cost=65536,
    parallelism=1,
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


async def get_user_by_id(db: AsyncSession, userId: UUID) -> Optional[User]:
    """
    Get user by ID

    Args:
        db: Database session
        userId: User UUID

    Returns:
        User object if found, None otherwise
    """
    stmt = select(User).where(User.id == userId)
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
    password_hash = hash_password(password)

    # Create user
    user = User(email=email, password_hash=password_hash)
    db.add(user)
    await db.commit()
    await db.refresh(user)

    logger.info("User created", userId=str(user.id), email=email)
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
    try:
        return password_hasher.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
    except (InvalidHashError, Argon2Error):
        logger.warning("Invalid password hash encountered during verification")
        return False


def hash_password(password: str) -> str:
    """Hash a plaintext password with Argon2id."""
    return password_hasher.hash(password)


async def update_user(db: AsyncSession, userId: UUID, **kwargs) -> Optional[User]:
    """
    Update user information

    Args:
        db: Database session
        userId: User UUID
        **kwargs: Fields to update (email, password_hash, etc.)

    Returns:
        Updated User object if found, None otherwise
    """
    user = await get_user_by_id(db, userId)
    if not user:
        return None

    # Update fields
    for key, value in kwargs.items():
        if hasattr(user, key):
            setattr(user, key, value)

    await db.commit()
    await db.refresh(user)

    logger.info("User updated", userId=str(userId), fields=list(kwargs.keys()))
    return user


async def change_password(db: AsyncSession, userId: UUID, new_password: str) -> bool:
    """
    Change user password

    Args:
        db: Database session
        userId: User UUID
        new_password: New plain text password (will be hashed)

    Returns:
        True if password was changed, False if user not found
    """
    # Hash password (Argon2 supports passwords up to 2^32-1 bytes)
    password_hash = hash_password(new_password)
    user = await update_user(db, userId, password_hash=password_hash)

    if user:
        logger.info("Password changed", userId=str(userId))
        return True

    return False
