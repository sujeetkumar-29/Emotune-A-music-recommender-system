from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import Field
from pymongo import IndexModel


class Favorite(Document):
    user_id: str
    video_id: str
    title: str
    thumbnail_url: str
    channel: str
    emotion_context: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "favorites"
        indexes = [
            IndexModel([("user_id", 1), ("video_id", 1)], unique=True),
        ]
