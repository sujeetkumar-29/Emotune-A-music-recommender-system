from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import EmailStr, Field
from pymongo import IndexModel


class User(Document):
    email: EmailStr
    hashed_password: Optional[str] = None  # None for Google-only accounts
    google_id: Optional[str] = None
    name: str
    avatar_url: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True
    theme_preference: str = "light"  # "light" | "dark"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = [
            IndexModel("email", unique=True),
            IndexModel("google_id"),
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "Jane Doe",
            }
        }
