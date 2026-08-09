from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import Field
from pymongo import IndexModel


class DetectionHistory(Document):
    user_id: str
    emotion: str
    confidence: float
    source: str  # "live" | "upload"
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "detection_history"
        indexes = [
            IndexModel("user_id"),
            IndexModel("created_at"),
        ]
