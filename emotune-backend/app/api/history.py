from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import get_current_user
from app.models.detection_history import DetectionHistory
from app.models.user import User
from app.schemas.music import HistoryOut, PaginatedHistory

router = APIRouter(prefix="/history", tags=["history"])


def _to_out(item: DetectionHistory) -> HistoryOut:
    return HistoryOut(
        id=str(item.id),
        emotion=item.emotion,
        confidence=item.confidence,
        source=item.source,
        image_url=item.image_url,
        created_at=item.created_at,
    )


@router.get("", response_model=PaginatedHistory)
async def list_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    emotion: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    query = DetectionHistory.find(DetectionHistory.user_id == str(current_user.id))
    if emotion:
        query = query.find(DetectionHistory.emotion == emotion.lower())

    total = await query.count()
    items = (
        await query.sort(-DetectionHistory.created_at)
        .skip((page - 1) * page_size)
        .limit(page_size)
        .to_list()
    )

    return PaginatedHistory(
        total=total,
        page=page,
        page_size=page_size,
        items=[_to_out(i) for i in items],
    )


@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_history_item(history_id: str, current_user: User = Depends(get_current_user)):
    item = await DetectionHistory.get(history_id)
    if not item or item.user_id != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History item not found")
    await item.delete()


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_history(current_user: User = Depends(get_current_user)):
    await DetectionHistory.find(DetectionHistory.user_id == str(current_user.id)).delete()
