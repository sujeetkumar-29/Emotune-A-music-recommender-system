from fastapi import APIRouter, Depends, File, UploadFile, status

from app.core.security import get_current_user
from app.ml.predict import decode_base64_image, decode_image_bytes, predict_emotion
from app.models.detection_history import DetectionHistory
from app.models.user import User
from app.schemas.emotion import EmotionResult, LiveFrameRequest

router = APIRouter(prefix="/detect", tags=["emotion detection"])


@router.post("/live", response_model=EmotionResult)
async def detect_live(payload: LiveFrameRequest, current_user: User = Depends(get_current_user)):
    image = decode_base64_image(payload.image_base64)
    result = predict_emotion(image)

    history = DetectionHistory(
        user_id=str(current_user.id),
        emotion=result["emotion"],
        confidence=result["confidence"],
        source="live",
    )
    await history.insert()

    return EmotionResult(**result, history_id=str(history.id))


@router.post("/upload", response_model=EmotionResult, status_code=status.HTTP_200_OK)
async def detect_upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    contents = await file.read()
    image = decode_image_bytes(contents)
    result = predict_emotion(image)

    history = DetectionHistory(
        user_id=str(current_user.id),
        emotion=result["emotion"],
        confidence=result["confidence"],
        source="upload",
    )
    await history.insert()

    return EmotionResult(**result, history_id=str(history.id))
