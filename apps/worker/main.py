"""
TaskFlow Celery Worker Entry Point
"""

from celery import Celery
from celery.schedules import crontab

from config.settings import settings
from tasks import analytics  # noqa: F401, E402

# Create Celery app
app = Celery(
    "taskflow",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["tasks.analytics"],
)

# Celery configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    broker_connection_retry_on_startup=True,  # Fix deprecation warning
    # Dead Letter Queue configuration
    task_reject_on_worker_lost=True,
    task_acks_late=True,
    task_default_queue="default",
    task_default_exchange="default",
    task_default_routing_key="default",
    # DLQ settings
    task_default_delivery_mode=2,  # Persistent
    task_ignore_result=False,
    # Failed task handling
    task_send_sent_event=True,
    worker_send_task_events=True,
    # DLQ queue name
    task_default_dead_letter_queue="dlq",
    task_default_dead_letter_exchange="dlq",
    task_default_dead_letter_routing_key="dlq",
)

# Periodic tasks
app.conf.beat_schedule = {
    "aggregate-analytics-hourly": {
        "task": "tasks.analytics.aggregate_task_analytics",
        "schedule": crontab(minute=0),  # Every hour
    },
}

if __name__ == "__main__":
    app.start()
