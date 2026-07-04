"""Endpoints do mapa (1 módulo por camada; espelha o pacote services/dados).

Interface estável: `api.py` monta só este `router`, que agrega os módulos —
`concentracao` (pins do GET /mapa), `rede` (qualidade de rede do GET /mapa/rede),
`mobilidade` (fluxos OD do GET /mapa/mobilidade) e `overview` (bairros ×
monitoramento do GET /mapa/overview).
"""

from fastapi import APIRouter

from app.api.v1.endpoints.mapa import concentracao, mobilidade, overview, rede

router = APIRouter()
router.include_router(concentracao.router)
router.include_router(mobilidade.router)
router.include_router(overview.router)
router.include_router(rede.router)

__all__ = ["router"]
