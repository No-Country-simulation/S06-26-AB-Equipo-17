"""Endpoints do mapa (1 módulo por camada; espelha o pacote services/dados).

Interface estável: `api.py` monta só este `router`, que agrega os módulos —
`concentracao` (pins do GET /mapa) e `mobilidade` (fluxos OD do GET /mapa/mobilidade).
"""

from fastapi import APIRouter

from app.api.v1.endpoints.mapa import concentracao, mobilidade

router = APIRouter()
router.include_router(concentracao.router)
router.include_router(mobilidade.router)

__all__ = ["router"]
