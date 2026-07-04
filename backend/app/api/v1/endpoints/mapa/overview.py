"""GET /mapa/overview — referencial de bairros × monitoramento (mancha do mapa)."""

from fastapi import APIRouter

from app.schemas.dados import VisualizacaoOverview
from app.services.dados import buscar_monitoramento

router = APIRouter()


@router.get("/mapa/overview", response_model=VisualizacaoOverview)
def overview_monitoramento():
    # cruzamento pronto no service: bairro sem monitoramento vai vazio
    # (monitorado=False, zonas=[]) — o front só separa preenchido × vazio
    cruzamento = buscar_monitoramento()
    return VisualizacaoOverview(
        tipo="overview",
        total_antenas=cruzamento["total_antenas"],
        dados=cruzamento["bairros"],
        zonas_fora_referencial=cruzamento["zonas_fora"],
    )
