"""App BiT — API (FastAPI). Ponto de entrada."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router


def create_app() -> FastAPI:
    app = FastAPI(title="App BiT — API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o for o in ["http://localhost:5173", settings.frontend_origin] if o],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Rotas na raiz (contrato: /health, /dados, /mapa).
    # Para versionar por URL no futuro: app.include_router(api_router, prefix="/api/v1").
    app.include_router(api_router)
    return app


app = create_app()
