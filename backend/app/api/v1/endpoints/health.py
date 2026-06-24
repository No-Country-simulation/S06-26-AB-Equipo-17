from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health", tags=["health"])
def health():
    return {"status": "ok", "ai_provider": settings.ai_provider}
