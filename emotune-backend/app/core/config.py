from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Emotune API"
    ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "emotune"

    # JWT
    JWT_SECRET_KEY: str = "insecure-dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"

    # YouTube
    YOUTUBE_API_KEY: str = ""

    # ML
    MODEL_PATH: str = "./ml_models/best_fer_model.keras"
    FACE_CASCADE_PATH: str = "./ml_models/haarcascade_frontalface_default.xml"
    EMOTION_LABELS: List[str] = [
        "angry",
        "disgust",
        "fear",
        "happy",
        "neutral",
        "sad",
        "surprise",
    ]

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
