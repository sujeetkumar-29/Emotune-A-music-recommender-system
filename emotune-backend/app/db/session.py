import logging

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.models.detection_history import DetectionHistory
from app.models.favorite import Favorite
from app.models.user import User

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.DATABASE_URL)
    return _client


async def init_db() -> None:
    """Called once from the FastAPI lifespan handler on startup."""
    client = get_client()
    database = client[settings.DATABASE_NAME]

    await init_beanie(
        database=database,
        document_models=[User, DetectionHistory, Favorite],
    )
    logger.info("Beanie initialized against database '%s'", settings.DATABASE_NAME)


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
