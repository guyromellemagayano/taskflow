"""
TaskFlow FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
from strawberry.fastapi import GraphQLRouter
from prometheus_client import make_asgi_app, Counter, Histogram

from app.core.config import settings
from app.core.errors import setup_exception_handlers
from app.graphql.schema import schema
from app.auth.routes import router as auth_router
from app.middleware.rate_limit import setup_rate_limiting

logger = structlog.get_logger(__name__)

app = FastAPI(
    title="TaskFlow API",
    description="TaskFlow GraphQL API",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup exception handlers
setup_exception_handlers(app)

# Setup rate limiting
setup_rate_limiting(app)

# Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Request metrics
REQUEST_COUNT = Counter("http_requests_total", "Total HTTP requests", ["method", "endpoint"])
REQUEST_DURATION = Histogram(
    "http_request_duration_seconds", "HTTP request duration", ["method", "endpoint"]
)

# GraphQL endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# Auth routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])


@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse(
        {
            "message": "Welcome to TaskFlow API",
            "version": "0.1.0",
            "endpoints": {
                "health": "/health",
                "ready": "/ready",
                "api": "/api",
                "graphql": "/graphql",
            },
        }
    )


@app.get("/api")
async def api_info():
    """API information endpoint"""
    return JSONResponse(
        {
            "message": "TaskFlow API",
            "version": "0.1.0",
            "status": "running",
            "endpoints": {"health": "/health", "ready": "/ready", "root": "/"},
        }
    )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({"status": "healthy"})


@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return JSONResponse({"status": "ready"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
