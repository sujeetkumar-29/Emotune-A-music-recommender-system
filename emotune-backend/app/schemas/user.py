from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None
    is_verified: bool
    theme_preference: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    theme_preference: Optional[str] = None
