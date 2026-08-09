from fastapi import APIRouter, Depends, Query

from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.music import RecommendationResponse, TrackOut
from app.services.youtube_service import query_for_emotion, search_tracks

router = APIRouter(prefix="/music", tags=["music"])


@router.get("/recommend", response_model=RecommendationResponse)
async def recommend(
    emotion: str = Query(..., description="Detected emotion, e.g. 'happy'"),
    max_results: int = Query(12, ge=1, le=25),
    current_user: User = Depends(get_current_user),
):
    emotion = emotion.lower()
    if emotion not in settings.EMOTION_LABELS:
        emotion = "neutral"

    tracks = await search_tracks(emotion, max_results=max_results)

    return RecommendationResponse(
        emotion=emotion,
        query_used=query_for_emotion(emotion),
        tracks=[TrackOut(**t) for t in tracks],
    )
