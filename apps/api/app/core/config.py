"""Application configuration"""

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
    CORS_ORIGINS: list[str] = [
        "http://localhost:8000",
        "http://taskflow.localhost:8000",
    ]

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
