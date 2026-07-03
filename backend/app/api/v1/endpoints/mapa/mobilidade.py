"""GET /mapa/mobilidade — fluxos origem→destino pro mapa (linhas/setas + hover)."""

from fastapi import APIRouter, Query

from app.schemas.dados import FluxoMapa, VisualizacaoFluxos
from app.services.dados import buscar_mobilidade

router = APIRouter()


@router.get("/mapa/mobilidade", response_model=VisualizacaoFluxos)
def fluxos_mobilidade(regiao: str | None = Query(default=None)):
    # sem `regiao`: os 80 maiores fluxos por viagens; com `regiao`: tudo que toca a zona
    registros = buscar_mobilidade(regiao=regiao)

    fluxos = [
        FluxoMapa(
            origem=r.get("cluster_origem", ""),
            destino=r.get("cluster_destino", ""),
            municipio_origem=r.get("municipio_origem"),
            municipio_destino=r.get("municipio_destino"),
            lat_origem=r.get("lat_origem"),
            lng_origem=r.get("lon_origem"),
            lat_destino=r.get("lat_destino"),
            lng_destino=r.get("lon_destino"),
            viagens=r.get("n_viagens"),
            usuarios=r.get("n_usuarios"),
            dist_km=r.get("dist_media_km"),
            periodo=r.get("periodo_predominante"),
            mesmo_cluster=r.get("mesmo_cluster"),
        )
        for r in registros
    ]
    return VisualizacaoFluxos(tipo="fluxos", dados=fluxos)
