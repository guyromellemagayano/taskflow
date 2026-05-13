"""Task analytics aggregation and snapshot persistence."""

from __future__ import annotations

import json
from collections.abc import Callable
from datetime import datetime, timedelta, timezone
from typing import Any

import redis.asyncio as aioredis
import structlog
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from config.settings import settings

logger = structlog.get_logger(__name__)

TASK_ANALYTICS_LATEST_KEY = "analytics:tasks:latest"
TASK_ANALYTICS_HISTORY_KEY = "analytics:tasks:history"
TASK_ANALYTICS_HISTORY_LIMIT = 168
TASK_ANALYTICS_VERSION = 1

STATUS_BUCKETS = ("todo", "in_progress", "done")
PRIORITY_BUCKETS = ("low", "medium", "high")

SessionFactory = Callable[[], AsyncSession]

_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None
_redis_client: aioredis.Redis | None = None


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Create or return the worker's async database session factory."""
    global _engine, _session_factory

    if _session_factory is None:
        _engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)
        _session_factory = async_sessionmaker(
            _engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )

    return _session_factory


async def get_redis_client() -> aioredis.Redis:
    """Create or return the worker's Redis client."""
    global _redis_client

    if _redis_client is None:
        _redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

    return _redis_client


async def _fetch_scalar_count(session: AsyncSession, query: str, **params: Any) -> int:
    result = await session.execute(text(query), params)
    return int(result.scalar_one() or 0)


async def _fetch_bucket_counts(
    session: AsyncSession, query: str, buckets: tuple[str, ...]
) -> dict[str, int]:
    result = await session.execute(text(query))
    counts = {bucket: 0 for bucket in buckets}

    for bucket, count in result.all():
        key = str(bucket)
        if key in counts:
            counts[key] = int(count)

    return counts


def _normalize_now(now: datetime | None = None) -> datetime:
    current = now or datetime.now(timezone.utc)
    if current.tzinfo is None:
        return current.replace(tzinfo=timezone.utc)
    return current.astimezone(timezone.utc)


def _to_utc_timestamp(value: datetime) -> str:
    return _normalize_now(value).isoformat().replace("+00:00", "Z")


async def build_task_analytics_snapshot(
    session: AsyncSession, now: datetime | None = None
) -> dict[str, Any]:
    """Collect the latest task analytics snapshot from the database."""
    snapshot_now = _normalize_now(now)
    today = snapshot_now.date()
    due_soon_deadline = today + timedelta(days=7)

    total_tasks = await _fetch_scalar_count(session, "SELECT COUNT(*) FROM tasks")
    active_users = await _fetch_scalar_count(session, "SELECT COUNT(DISTINCT user_id) FROM tasks")
    by_status = await _fetch_bucket_counts(
        session,
        "SELECT status::text AS bucket, COUNT(*) AS count FROM tasks GROUP BY status",
        STATUS_BUCKETS,
    )
    by_priority = await _fetch_bucket_counts(
        session,
        "SELECT priority::text AS bucket, COUNT(*) AS count FROM tasks GROUP BY priority",
        PRIORITY_BUCKETS,
    )
    overdue = await _fetch_scalar_count(
        session,
        """
        SELECT COUNT(*)
        FROM tasks
        WHERE due_date IS NOT NULL
          AND due_date < :today
          AND status <> 'done'::taskstatus
        """,
        today=today,
    )
    due_today = await _fetch_scalar_count(
        session,
        """
        SELECT COUNT(*)
        FROM tasks
        WHERE due_date = :today
          AND status <> 'done'::taskstatus
        """,
        today=today,
    )
    due_soon = await _fetch_scalar_count(
        session,
        """
        SELECT COUNT(*)
        FROM tasks
        WHERE due_date > :today
          AND due_date <= :due_soon_deadline
          AND status <> 'done'::taskstatus
        """,
        today=today,
        due_soon_deadline=due_soon_deadline,
    )

    completed = by_status["done"]
    open_tasks = total_tasks - completed
    completion_rate = round(completed / total_tasks, 4) if total_tasks else 0.0

    return {
        "version": TASK_ANALYTICS_VERSION,
        "generatedAt": _to_utc_timestamp(snapshot_now),
        "totals": {
            "tasks": total_tasks,
            "activeUsers": active_users,
            "completed": completed,
            "open": open_tasks,
            "overdue": overdue,
            "dueToday": due_today,
            "dueSoon": due_soon,
            "completionRate": completion_rate,
        },
        "byStatus": by_status,
        "byPriority": by_priority,
    }


async def persist_task_analytics_snapshot(
    snapshot: dict[str, Any], redis_client: aioredis.Redis | None = None
) -> None:
    """Persist the latest analytics snapshot and rolling history to Redis."""
    client = redis_client or await get_redis_client()
    payload = json.dumps(snapshot, sort_keys=True)

    await client.set(TASK_ANALYTICS_LATEST_KEY, payload)
    await client.lpush(TASK_ANALYTICS_HISTORY_KEY, payload)
    await client.ltrim(TASK_ANALYTICS_HISTORY_KEY, 0, TASK_ANALYTICS_HISTORY_LIMIT - 1)


async def run_task_analytics_aggregation(
    session_factory: SessionFactory | None = None,
    redis_client: aioredis.Redis | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Collect and persist the latest task analytics snapshot."""
    factory = session_factory or get_session_factory()

    async with factory() as session:
        snapshot = await build_task_analytics_snapshot(session, now=now)

    await persist_task_analytics_snapshot(snapshot, redis_client=redis_client)

    logger.info(
        "Task analytics snapshot persisted",
        generated_at=snapshot["generatedAt"],
        total_tasks=snapshot["totals"]["tasks"],
        active_users=snapshot["totals"]["activeUsers"],
        overdue=snapshot["totals"]["overdue"],
    )
    return snapshot
