"""Initial migration: create users and tasks tables

Revision ID: 001_initial
Revises:
Create Date: 2026-01-09 12:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column(
            "createdAt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updatedAt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )

    # Create indexes for users
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_createdAt", "users", ["createdAt"])

    # Create tasks table
    op.create_table(
        "tasks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("todo", "in_progress", "done", name="taskstatus"),
            nullable=False,
            server_default="todo",
        ),
        sa.Column(
            "priority",
            sa.Enum("low", "medium", "high", name="taskpriority"),
            nullable=False,
            server_default="medium",
        ),
        sa.Column("dueDate", sa.Date(), nullable=True),
        sa.Column("userId", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "createdAt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updatedAt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["userId"],
            ["users.id"],
        ),
    )

    # Create indexes for tasks
    op.create_index("ix_tasks_status", "tasks", ["status"])
    op.create_index("ix_tasks_priority", "tasks", ["priority"])
    op.create_index("ix_tasks_dueDate", "tasks", ["dueDate"])
    op.create_index("ix_tasks_userId", "tasks", ["userId"])
    op.create_index("ix_tasks_createdAt", "tasks", ["createdAt"])

    # Create composite indexes for common queries
    op.create_index("idx_user_status", "tasks", ["userId", "status"])
    op.create_index("idx_user_dueDate", "tasks", ["userId", "dueDate"])
    op.create_index("idx_user_created", "tasks", ["userId", "createdAt"])


def downgrade() -> None:
    # Drop indexes first
    op.drop_index("idx_user_created", table_name="tasks")
    op.drop_index("idx_user_dueDate", table_name="tasks")
    op.drop_index("idx_user_status", table_name="tasks")
    op.drop_index("ix_tasks_createdAt", table_name="tasks")
    op.drop_index("ix_tasks_userId", table_name="tasks")
    op.drop_index("ix_tasks_dueDate", table_name="tasks")
    op.drop_index("ix_tasks_priority", table_name="tasks")
    op.drop_index("ix_tasks_status", table_name="tasks")

    # Drop tables
    op.drop_table("tasks")
    op.drop_table("users")

    # Drop enums
    op.execute("DROP TYPE IF EXISTS taskpriority")
    op.execute("DROP TYPE IF EXISTS taskstatus")
