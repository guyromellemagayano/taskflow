"""Application configuration"""

import json
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    # Database
    # Docker PostgreSQL runs on port 5433 (configurable via POSTGRES_PORT env var)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/taskflow"

    # Redis
    # Docker Redis runs on port 6380
    REDIS_URL: str = "redis://localhost:6380/0"

    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS (Traefik routes)
    # Accept both JSON string from env or list
    # Note: Must include all origins that will make requests (cannot use wildcard with credentials)
    CORS_ORIGINS: str | List[str] = [
        "http://localhost:8000",
        "http://taskflow.localhost:8000",
        "http://api.localhost:8000",
        "http://localhost:3000",  # Next.js dev server (if running locally)
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from JSON string or list"""
        if isinstance(v, str):
            try:
                # Try parsing as JSON array
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, TypeError):
                # If not JSON, treat as comma-separated string
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Cookie settings
    COOKIE_SECURE: bool = False  # Set to True in production (HTTPS only)
    COOKIE_HTTPONLY: bool = True  # httpOnly cookies for security
    COOKIE_SAMESITE: str = "lax"  # CSRF protection: "strict", "lax", or "none"

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
