# app/core/config.py
"""
Centralized application configuration.
Reads values from environment variables (via .env in development).
Every other module should import `settings` from here — never call
os.getenv() directly anywhere else in the app.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ---------- Database ----------
    DATABASE_URL: str

    # ---------- JWT Auth ----------
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ---------- Cloudinary ----------
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # ---------- App ----------
    ENVIRONMENT: str = "development"
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    # Tells pydantic-settings to load variables from a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


# Single shared instance — import this everywhere else
settings = Settings()
