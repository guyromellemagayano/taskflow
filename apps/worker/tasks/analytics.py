"""
Analytics aggregation tasks
"""

import asyncio

from celery import shared_task
import structlog

from services.analytics import run_task_analytics_aggregation

logger = structlog.get_logger(__name__)


@shared_task(bind=True, max_retries=3, name="tasks.analytics.aggregate_task_analytics")
def aggregate_task_analytics(self) -> dict:
    """
    Aggregate task analytics data.
    This task runs periodically to pre-compute analytics.
    """
    try:
        logger.info("Starting task analytics aggregation")
        snapshot = asyncio.run(run_task_analytics_aggregation())
        logger.info(
            "Task analytics aggregation completed",
            generated_at=snapshot["generatedAt"],
            total_tasks=snapshot["totals"]["tasks"],
        )
        return snapshot
    except Exception as exc:
        logger.exception("Error aggregating task analytics", exc_info=exc)
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2**self.request.retries))
