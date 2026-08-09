from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


def _to_out(user: User) -> UserOut:
    return UserOut(
        id=str(user.id),
        email=user.email,
        name=user.name,
        avatar_url=user.avatar_url,
        is_verified=user.is_verified,
        theme_preference=user.theme_preference,
        created_at=user.created_at,
    )


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return _to_out(current_user)


@router.put("/me", response_model=UserOut)
async def update_me(payload: UserUpdate, current_user: User = Depends(get_current_user)):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    await current_user.save()
    return _to_out(current_user)
