from typing import List

import httpx
from fastapi import HTTPException, status

from app.core.config import settings

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

EMOTION_QUERY_MAP = {
    "happy": "upbeat feel-good songs",
    "sad": "calm acoustic songs to relax",
    "angry": "chill lofi beats to cool down",
    "surprise": "trending viral songs",
    "neutral": "popular chill mix",
    "fear": "soothing ambient music",
    "disgust": "energetic rock playlist",
}

DEFAULT_QUERY = "popular music mix"


def query_for_emotion(emotion: str) -> str:
    return EMOTION_QUERY_MAP.get(emotion.lower(), DEFAULT_QUERY)


async def search_tracks(emotion: str, max_results: int = 12) -> List[dict]:
    if not settings.YOUTUBE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="YouTube API key is not configured on the server.",
        )

    query = query_for_emotion(emotion)
    params = {
        "part": "snippet",
        "q": f"{query} music",
        "type": "video",
        "videoCategoryId": "10",  # Music category
        "maxResults": max_results,
        "safeSearch": "moderate",
        "key": settings.YOUTUBE_API_KEY,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(YOUTUBE_SEARCH_URL, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"YouTube API request failed: {response.text}",
        )

    data = response.json()
    tracks = []
    for item in data.get("items", []):
        video_id = item.get("id", {}).get("videoId")
        snippet = item.get("snippet", {})
        if not video_id:
            continue
        tracks.append(
            {
                "video_id": video_id,
                "title": snippet.get("title", "Untitled"),
                "channel": snippet.get("channelTitle", "Unknown"),
                "thumbnail_url": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            }
        )

    return tracks
