import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from services.analytics import (
    TASK_ANALYTICS_HISTORY_KEY,
    TASK_ANALYTICS_HISTORY_LIMIT,
    TASK_ANALYTICS_LATEST_KEY,
    build_task_analytics_snapshot,
    persist_task_analytics_snapshot,
    run_task_analytics_aggregation,
)


class FakeResult:
    def __init__(self, scalar=None, rows=None):
        self._scalar = scalar
        self._rows = rows or []

    def scalar_one(self):
        return self._scalar

    def all(self):
        return self._rows


class FakeSession:
    def __init__(self, results):
        self._results = iter(results)
        self.executed = []

    async def execute(self, statement, params=None):
        self.executed.append((str(statement), params or {}))
        return next(self._results)


class FakeSessionContext:
    def __init__(self, session):
        self._session = session

    async def __aenter__(self):
        return self._session

    async def __aexit__(self, exc_type, exc, tb):
        return False


class FakeSessionFactory:
    def __init__(self, session):
        self._session = session

    def __call__(self):
        return FakeSessionContext(self._session)


class FakeRedis:
    def __init__(self):
        self.values = {}
        self.lists = {}

    async def set(self, key, value):
        self.values[key] = value

    async def lpush(self, key, value):
        self.lists.setdefault(key, [])
        self.lists[key].insert(0, value)

    async def ltrim(self, key, start, end):
        items = self.lists.get(key, [])
        self.lists[key] = items[start : end + 1]


def test_build_task_analytics_snapshot_normalizes_buckets_and_totals():
    session = FakeSession(
        [
            FakeResult(scalar=8),
            FakeResult(scalar=3),
            FakeResult(rows=[("todo", 3), ("done", 2)]),
            FakeResult(rows=[("high", 2)]),
            FakeResult(scalar=1),
            FakeResult(scalar=2),
            FakeResult(scalar=3),
        ]
    )

    snapshot = asyncio.run(
        build_task_analytics_snapshot(
            session,
            now=datetime(2026, 5, 13, 9, 0, tzinfo=timezone.utc),
        )
    )

    assert snapshot == {
        "version": 1,
        "generatedAt": "2026-05-13T09:00:00Z",
        "totals": {
            "tasks": 8,
            "activeUsers": 3,
            "completed": 2,
            "open": 6,
            "overdue": 1,
            "dueToday": 2,
            "dueSoon": 3,
            "completionRate": 0.25,
        },
        "byStatus": {
            "todo": 3,
            "in_progress": 0,
            "done": 2,
        },
        "byPriority": {
            "low": 0,
            "medium": 0,
            "high": 2,
        },
    }
    assert session.executed[4][1]["today"].isoformat() == "2026-05-13"
    assert session.executed[6][1]["due_soon_deadline"].isoformat() == "2026-05-20"


def test_persist_task_analytics_snapshot_keeps_latest_and_trims_history():
    redis = FakeRedis()

    for index in range(TASK_ANALYTICS_HISTORY_LIMIT + 2):
        snapshot = {
            "version": 1,
            "generatedAt": f"snapshot-{index}",
            "totals": {"tasks": index},
            "byStatus": {"todo": index},
            "byPriority": {"medium": index},
        }
        asyncio.run(persist_task_analytics_snapshot(snapshot, redis_client=redis))

    latest_snapshot = json.loads(redis.values[TASK_ANALYTICS_LATEST_KEY])
    assert latest_snapshot["generatedAt"] == "snapshot-169"
    assert len(redis.lists[TASK_ANALYTICS_HISTORY_KEY]) == TASK_ANALYTICS_HISTORY_LIMIT
    assert json.loads(redis.lists[TASK_ANALYTICS_HISTORY_KEY][0])["generatedAt"] == "snapshot-169"


def test_run_task_analytics_aggregation_returns_and_persists_snapshot():
    session = FakeSession(
        [
            FakeResult(scalar=5),
            FakeResult(scalar=2),
            FakeResult(rows=[("todo", 1), ("in_progress", 2), ("done", 2)]),
            FakeResult(rows=[("low", 1), ("medium", 3), ("high", 1)]),
            FakeResult(scalar=1),
            FakeResult(scalar=1),
            FakeResult(scalar=2),
        ]
    )
    redis = FakeRedis()

    snapshot = asyncio.run(
        run_task_analytics_aggregation(
            session_factory=FakeSessionFactory(session),
            redis_client=redis,
            now=datetime(2026, 5, 13, 12, 30, tzinfo=timezone.utc),
        )
    )

    assert snapshot["generatedAt"] == "2026-05-13T12:30:00Z"
    assert snapshot["totals"]["tasks"] == 5
    assert snapshot["totals"]["completionRate"] == 0.4
    assert json.loads(redis.values[TASK_ANALYTICS_LATEST_KEY]) == snapshot
