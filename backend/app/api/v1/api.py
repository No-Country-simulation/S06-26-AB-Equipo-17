"""Router mestre da v1 (montado sob /api/v1): /health, /dados e /mapa (pacote)."""

from fastapi import APIRouter

from app.api.v1.endpoints import dados, health, mapa

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(dados.router)
api_router.include_router(mapa.router)
