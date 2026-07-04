from fastapi import APIRouter, Query

from app.schemas.dados import PontoMapa, Visualizacao
from app.services.dados.concentracao import buscar

router = APIRouter()


@router.get("/mapa/rede", response_model=Visualizacao)
def dados_mapa_rede(regiao: str | None = Query(default=None)):
    registros = buscar(regiao=regiao, limite=100)

    pontos = []
    for r in registros:
        congestionamento = r.get("congestionamento")
        drop = r.get("drop_rede")

        sem_dados = congestionamento is None or drop is None

        pontos.append(
            PontoMapa(
                regiao=r.get("cluster", ""),
                lat=r.get("lat"),
                lng=r.get("lon"),
                valor=congestionamento,
                sem_dados=sem_dados,
            )
        )
        return Visualizacao(tipo="mapa", dados=pontos)
