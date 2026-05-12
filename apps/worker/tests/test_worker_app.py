from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from main import app


def test_worker_app_configuration():
    assert app.main == "taskflow"
    assert app.conf.task_default_queue == "default"
    assert "aggregate-analytics-hourly" in app.conf.beat_schedule
