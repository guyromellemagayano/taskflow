"""Align initial schema column names with ORM metadata

Revision ID: 002_align_snake_case
Revises: 001_initial
Create Date: 2026-05-12 16:10:00.000000

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "002_align_snake_case"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the redundant uniqueness constraint created by the initial revision.
    # The ORM metadata defines a unique index for users.email instead.
    op.drop_constraint("users_email_key", "users", type_="unique")

    op.alter_column("users", "createdAt", new_column_name="created_at")
    op.alter_column("users", "updatedAt", new_column_name="updated_at")

    op.alter_column("tasks", "dueDate", new_column_name="due_date")
    op.alter_column("tasks", "userId", new_column_name="user_id")
    op.alter_column("tasks", "createdAt", new_column_name="created_at")
    op.alter_column("tasks", "updatedAt", new_column_name="updated_at")

    op.execute('ALTER INDEX "ix_users_createdAt" RENAME TO ix_users_created_at')
    op.execute('ALTER INDEX "ix_tasks_dueDate" RENAME TO ix_tasks_due_date')
    op.execute('ALTER INDEX "ix_tasks_userId" RENAME TO ix_tasks_user_id')
    op.execute('ALTER INDEX "ix_tasks_createdAt" RENAME TO ix_tasks_created_at')


def downgrade() -> None:
    op.execute('ALTER INDEX ix_tasks_created_at RENAME TO "ix_tasks_createdAt"')
    op.execute('ALTER INDEX ix_tasks_user_id RENAME TO "ix_tasks_userId"')
    op.execute('ALTER INDEX ix_tasks_due_date RENAME TO "ix_tasks_dueDate"')
    op.execute('ALTER INDEX ix_users_created_at RENAME TO "ix_users_createdAt"')

    op.alter_column("tasks", "updated_at", new_column_name="updatedAt")
    op.alter_column("tasks", "created_at", new_column_name="createdAt")
    op.alter_column("tasks", "user_id", new_column_name="userId")
    op.alter_column("tasks", "due_date", new_column_name="dueDate")

    op.alter_column("users", "updated_at", new_column_name="updatedAt")
    op.alter_column("users", "created_at", new_column_name="createdAt")

    op.create_unique_constraint("users_email_key", "users", ["email"])
