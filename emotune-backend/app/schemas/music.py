from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class TrackOut(BaseModel):
    video_id: str
    title: str
    channel: str
    thumbnail_url: str


class RecommendationResponse(BaseModel):
    emotion: str
    query_used: str
    tracks: List[TrackOut]


class FavoriteCreate(BaseModel):
    video_id: str
    title: str
    thumbnail_url: str
    channel: str
    emotion_context: Optional[str] = None


class FavoriteOut(BaseModel):
    id: str
    video_id: str
    title: str
    thumbnail_url: str
    channel: str
    emotion_context: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryOut(BaseModel):
    id: str
    emotion: str
    confidence: float
    source: str
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedHistory(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[HistoryOut]
