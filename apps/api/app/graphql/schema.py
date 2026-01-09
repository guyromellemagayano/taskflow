"""Strawberry GraphQL schema"""

from datetime import UTC, date, datetime
from typing import List, Optional

import strawberry

# Phase 1: Basic GraphQL types and stub resolvers
# Phase 2: Will add actual database queries


@strawberry.type
class User:
    """User GraphQL type"""

    id: str
    email: str
    created_at: datetime


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
    async def me(self) -> Optional[User]:
        """Get current user (Phase 1: returns None)"""
        # Phase 1: Stub - returns None
        # Phase 2: Will get from authenticated context
        return None


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


# Create schema
schema = strawberry.Schema(query=Query, mutation=Mutation)
