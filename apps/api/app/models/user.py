"""User model"""

from uuid import uuid4

from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class User(Base):
    """User model"""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    createdAt = Column(
        "created_at",
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    updatedAt = Column(
        "updated_at",
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
