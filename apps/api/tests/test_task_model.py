"""Task model database enum behavior tests."""

from pathlib import Path
import sys

from sqlalchemy.dialects import postgresql

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models.task import Task, TaskPriority, TaskStatus


def test_task_status_enum_binds_lowercase_database_values():
    processor = Task.status.type.bind_processor(postgresql.dialect())

    assert Task.status.type.enums == ["todo", "in_progress", "done"]
    assert processor is not None
    assert processor(TaskStatus.TODO) == "todo"
    assert processor(TaskStatus.IN_PROGRESS) == "in_progress"
    assert processor(TaskStatus.DONE) == "done"


def test_task_priority_enum_binds_lowercase_database_values():
    processor = Task.priority.type.bind_processor(postgresql.dialect())

    assert Task.priority.type.enums == ["low", "medium", "high"]
    assert processor is not None
    assert processor(TaskPriority.LOW) == "low"
    assert processor(TaskPriority.MEDIUM) == "medium"
    assert processor(TaskPriority.HIGH) == "high"
