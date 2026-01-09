"""
TaskFlow FastAPI Application Entry Point
"""

import structlog
from app.auth.routes import router as auth_router
from app.cache import close_redis, get_redis
from app.core.config import settings
from app.core.errors import setup_exception_handlers
from app.graphql.context import get_context
from app.graphql.schema import schema
from app.middleware.rate_limit import setup_rate_limiting
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, Histogram, make_asgi_app
from strawberry.fastapi import GraphQLRouter

logger = structlog.get_logger(__name__)

app = FastAPI(
    title="TaskFlow API",
    description="TaskFlow GraphQL API",
    version="0.1.0",
)


# CORS middleware
# CORS_ORIGINS is already parsed by Pydantic validator in config.py
cors_origins = (
    settings.CORS_ORIGINS
    if isinstance(settings.CORS_ORIGINS, list)
    else list(settings.CORS_ORIGINS)
)

# Log CORS origins for debugging
logger.info("CORS origins configured", origins=cors_origins)

# Add CORS middleware - must be added before other middleware
# Note: Cannot use wildcard "*" when allow_credentials=True
# Must use specific origins even in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["*"],
    max_age=3600,
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
graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

# Auth routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    # Initialize Redis connection pool
    await get_redis()
    logger.info("Application startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    await close_redis()
    logger.info("Application shutdown complete")


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


@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, X-Requested-With",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "3600",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
