from typing import Dict, Optional

from pydantic import BaseModel


class LiveFrameRequest(BaseModel):
    image_base64: str  # data URL or raw base64 (with or without the "data:image/...;base64," prefix)


class EmotionResult(BaseModel):
    emotion: str
    confidence: float
    probabilities: Dict[str, float]
    history_id: Optional[str] = None
