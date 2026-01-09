"""Worker settings"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Worker settings"""

    # Redis (use Docker service name when in Docker, localhost when running locally)
    REDIS_URL: str = "redis://localhost:6380/0"

    # Database (use Docker service name when in Docker, localhost when running locally)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/taskflow"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
