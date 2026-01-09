"""Exception handlers"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import structlog

logger = structlog.get_logger(__name__)


class TaskFlowException(Exception):
    """Base exception for TaskFlow"""

    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


def setup_exception_handlers(app: FastAPI) -> None:
    """Setup global exception handlers"""

    @app.exception_handler(TaskFlowException)
    async def taskflow_exception_handler(request: Request, exc: TaskFlowException):
        logger.error(
            "TaskFlow exception",
            path=request.url.path,
            status_code=exc.status_code,
            message=exc.message,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message},
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.exception(
            "Unhandled exception",
            path=request.url.path,
            exc_info=exc,
        )
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"},
        )
