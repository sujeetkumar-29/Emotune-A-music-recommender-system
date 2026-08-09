import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware

from app.api import auth, emotion, favorites, history, music, users
from app.core.config import settings
from app.db.session import close_db, init_db
from app.ml.model_loader import load_model, unload_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up Emotune API...")
    await init_db()
    load_model()  # Load the Keras FER model once, not per-request
    logger.info("Startup complete.")

    yield

    logger.info("Shutting down Emotune API...")
    unload_model()
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    description="Facial emotion-based music recommender API.",
    version="1.0.0",
    lifespan=lifespan,
)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Required by authlib's Starlette OAuth client to store state between the
# /auth/google redirect and /auth/google/callback.
app.add_middleware(SessionMiddleware, secret_key=settings.JWT_SECRET_KEY)


# --- Error handling ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )


# --- Routers ---
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(emotion.router)
app.include_router(music.router)
app.include_router(history.router)
app.include_router(favorites.router)


@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "service": settings.APP_NAME}


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy"}
