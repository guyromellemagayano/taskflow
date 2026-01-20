"""Task service for database operations"""

from datetime import date
from typing import List, Optional
from uuid import UUID

import structlog
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskPriority, TaskStatus

logger = structlog.get_logger(__name__)


async def get_task_by_id(
    db: AsyncSession, task_id: UUID, userId: Optional[UUID] = None
) -> Optional[Task]:
    """
    Get task by ID, optionally filtered by userId

    Args:
        db: Database session
        task_id: Task UUID
        userId: Optional user UUID to filter by (for authorization)

    Returns:
        Task object if found, None otherwise
    """
    stmt = select(Task).where(Task.id == task_id)
    if userId:
        stmt = stmt.where(Task.userId == userId)

    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_tasks(
    db: AsyncSession,
    userId: UUID,
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    dueDate_from: Optional[date] = None,
    dueDate_to: Optional[date] = None,
    search: Optional[str] = None,
    sort_by: str = "createdAt",
    sort_order: str = "desc",
    limit: int = 50,
    offset: int = 0,
) -> List[Task]:
    """
    Get tasks with filtering, sorting, and pagination

    Args:
        db: Database session
        userId: User UUID (required for authorization)
        status: Optional status filter
        priority: Optional priority filter
        dueDate_from: Optional start date filter
        dueDate_to: Optional end date filter
        search: Optional search term (searches title and description)
        sort_by: Field to sort by (createdAt, dueDate, priority, title)
        sort_order: Sort order (asc, desc)
        limit: Maximum number of results
        offset: Number of results to skip

    Returns:
        List of Task objects
    """
    stmt = select(Task).where(Task.userId == userId)

    # Apply filters
    if status:
        stmt = stmt.where(Task.status == status)

    if priority:
        stmt = stmt.where(Task.priority == priority)

    if dueDate_from:
        stmt = stmt.where(Task.dueDate >= dueDate_from)

    if dueDate_to:
        stmt = stmt.where(Task.dueDate <= dueDate_to)

    if search:
        search_term = f"%{search.lower()}%"
        stmt = stmt.where(
            or_(
                func.lower(Task.title).like(search_term),
                func.lower(Task.description).like(search_term),
            )
        )

    # Apply sorting with validation
    valid_sort_fields = ["createdAt", "dueDate", "priority", "title", "updatedAt"]
    if sort_by not in valid_sort_fields:
        sort_by = "createdAt"  # Default to createdAt if invalid
    sort_field = getattr(Task, sort_by, Task.createdAt)
    if sort_order.lower() == "asc":
        stmt = stmt.order_by(sort_field.asc())
    else:
        stmt = stmt.order_by(sort_field.desc())

    # Apply pagination
    stmt = stmt.limit(limit).offset(offset)

    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_task(
    db: AsyncSession,
    userId: UUID,
    title: str,
    description: Optional[str] = None,
    status: TaskStatus = TaskStatus.TODO,
    priority: TaskPriority = TaskPriority.MEDIUM,
    dueDate: Optional[date] = None,
) -> Task:
    """
    Create a new task

    Args:
        db: Database session
        userId: User UUID (task owner)
        title: Task title
        description: Optional task description
        status: Task status (default: TODO)
        priority: Task priority (default: MEDIUM)
        dueDate: Optional due date

    Returns:
        Created Task object

    Raises:
        ValueError: If title is empty or invalid
    """
    if not title or not title.strip():
        raise ValueError("Task title is required")

    task = Task(
        userId=userId,
        title=title.strip(),
        description=description.strip() if description else None,
        status=status,
        priority=priority,
        dueDate=dueDate,
    )

    db.add(task)
    await db.commit()
    await db.refresh(task)

    logger.info(
        "Task created",
        task_id=str(task.id),
        userId=str(userId),
        title=title[:50],
    )
    return task


async def update_task(
    db: AsyncSession,
    task_id: UUID,
    userId: UUID,
    title: Optional[str] = None,
    description: Optional[str] = None,
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    dueDate: Optional[date] = None,
) -> Optional[Task]:
    """
    Update a task

    Args:
        db: Database session
        task_id: Task UUID
        userId: User UUID (for authorization - must own the task)
        title: Optional new title
        description: Optional new description
        status: Optional new status
        priority: Optional new priority
        dueDate: Optional new due date

    Returns:
        Updated Task object if found and authorized, None otherwise

    Raises:
        ValueError: If title is empty (when provided)
    """
    task = await get_task_by_id(db, task_id, userId=userId)
    if not task:
        return None

    # Update fields
    if title is not None:
        if not title.strip():
            raise ValueError("Task title cannot be empty")
        task.title = title.strip()

    if description is not None:
        task.description = description.strip() if description else None

    if status is not None:
        task.status = status

    if priority is not None:
        task.priority = priority

    if dueDate is not None:
        task.dueDate = dueDate

    await db.commit()
    await db.refresh(task)

    logger.info("Task updated", task_id=str(task_id), userId=str(userId))
    return task


async def delete_task(db: AsyncSession, task_id: UUID, userId: UUID) -> bool:
    """
    Delete a task

    Args:
        db: Database session
        task_id: Task UUID
        userId: User UUID (for authorization - must own the task)

    Returns:
        True if task was deleted, False if not found or not authorized
    """
    task = await get_task_by_id(db, task_id, userId=userId)
    if not task:
        return False

    db.delete(task)
    await db.commit()

    logger.info("Task deleted", task_id=str(task_id), userId=str(userId))
    return True


async def count_tasks(
    db: AsyncSession,
    userId: UUID,
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    dueDate_from: Optional[date] = None,
    dueDate_to: Optional[date] = None,
    search: Optional[str] = None,
) -> int:
    """
    Count tasks matching filters (for pagination)

    Args:
        db: Database session
        userId: User UUID
        status: Optional status filter
        priority: Optional priority filter
        dueDate_from: Optional start date filter
        dueDate_to: Optional end date filter
        search: Optional search term

    Returns:
        Number of tasks matching the filters
    """
    stmt = select(func.count(Task.id)).where(Task.userId == userId)

    if status:
        stmt = stmt.where(Task.status == status)

    if priority:
        stmt = stmt.where(Task.priority == priority)

    if dueDate_from:
        stmt = stmt.where(Task.dueDate >= dueDate_from)

    if dueDate_to:
        stmt = stmt.where(Task.dueDate <= dueDate_to)

    if search:
        search_term = f"%{search.lower()}%"
        stmt = stmt.where(
            or_(
                func.lower(Task.title).like(search_term),
                func.lower(Task.description).like(search_term),
            )
        )

    result = await db.execute(stmt)
    return result.scalar_one() or 0
