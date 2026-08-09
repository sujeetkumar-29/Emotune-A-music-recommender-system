from authlib.integrations.starlette_client import OAuthError
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.oauth import oauth
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenPair

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    existing = await User.find_one(User.email == payload.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    # No email verification step - accounts are created pre-verified and the
    # user is logged straight in, same as Google OAuth.
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        name=payload.name,
        is_verified=True,
    )
    await user.insert()

    return TokenPair(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest):
    user = await User.find_one(User.email == payload.email)
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    return TokenPair(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/refresh", response_model=TokenPair)
async def refresh_token(payload: RefreshRequest):
    data = decode_token(payload.refresh_token)
    if data.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = data.get("sub")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return TokenPair(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


# --- Google OAuth ---


@router.get("/google")
async def google_login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Google OAuth failed: {error.error}")

    userinfo = token.get("userinfo")
    if not userinfo:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not fetch Google user info")

    google_id = userinfo["sub"]
    email = userinfo["email"]
    name = userinfo.get("name", email.split("@")[0])
    avatar_url = userinfo.get("picture")

    user = await User.find_one(User.google_id == google_id)
    if not user:
        # Link to an existing email/password account if one exists, otherwise create new
        user = await User.find_one(User.email == email)
        if user:
            user.google_id = google_id
            user.avatar_url = user.avatar_url or avatar_url
        else:
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                avatar_url=avatar_url,
                is_verified=True,  # Google already verified the email
            )
            await user.insert()
            access = create_access_token(str(user.id))
            refresh = create_refresh_token(str(user.id))
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/oauth-callback?access_token={access}&refresh_token={refresh}"
            )
        await user.save()

    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/oauth-callback?access_token={access}&refresh_token={refresh}"
    )
