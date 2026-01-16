"""Task model"""

import enum
from uuid import uuid4

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Index, String, Text, func
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class TaskStatus(str, enum.Enum):
    """Task status enum"""

    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(str, enum.Enum):
    """Task priority enum"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(Base):
    """Task model"""

    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.TODO, index=True)
    priority = Column(Enum(TaskPriority), nullable=False, default=TaskPriority.MEDIUM, index=True)
    dueDate = Column("due_date", Date, nullable=True, index=True)
    userId = Column(
        "user_id", UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
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

    # Composite indexes for common queries
    __table_args__ = (
        Index("idx_user_status", "user_id", "status"),
        Index("idx_user_dueDate", "user_id", "due_date"),
        Index("idx_user_created", "user_id", "created_at"),
    )
