from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.models.favorite import Favorite
from app.models.user import User
from app.schemas.music import FavoriteCreate, FavoriteOut

router = APIRouter(prefix="/favorites", tags=["favorites"])


def _to_out(item: Favorite) -> FavoriteOut:
    return FavoriteOut(
        id=str(item.id),
        video_id=item.video_id,
        title=item.title,
        thumbnail_url=item.thumbnail_url,
        channel=item.channel,
        emotion_context=item.emotion_context,
        created_at=item.created_at,
    )


@router.get("", response_model=list[FavoriteOut])
async def list_favorites(current_user: User = Depends(get_current_user)):
    items = await Favorite.find(Favorite.user_id == str(current_user.id)).sort(-Favorite.created_at).to_list()
    return [_to_out(i) for i in items]


@router.post("", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED)
async def add_favorite(payload: FavoriteCreate, current_user: User = Depends(get_current_user)):
    existing = await Favorite.find_one(
        Favorite.user_id == str(current_user.id),
        Favorite.video_id == payload.video_id,
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Track already in favorites")

    favorite = Favorite(user_id=str(current_user.id), **payload.model_dump())
    await favorite.insert()
    return _to_out(favorite)


@router.delete("/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(favorite_id: str, current_user: User = Depends(get_current_user)):
    item = await Favorite.get(favorite_id)
    if not item or item.user_id != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")
    await item.delete()
