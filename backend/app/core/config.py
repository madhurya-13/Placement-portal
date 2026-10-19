# app/core/config.py
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # NEW

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    ENVIRONMENT: str = "development"
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def _normalize_db_url(cls, url: str) -> str:
        """Make any hosted-Postgres URL (Neon, Render, ...) work with our
        driver set. We ship psycopg 3 only, but dashboards hand out
        postgres:// links that SQLAlchemy resolves against psycopg2 —
        which would crash every request with ModuleNotFoundError."""
        if url.startswith("postgres://"):
            url = "postgresql://" + url.removeprefix("postgres://")
        if url.startswith("postgresql://"):
            url = "postgresql+psycopg://" + url.removeprefix("postgresql://")
        return url


settings = Settings()