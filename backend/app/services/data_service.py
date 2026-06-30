"""Acesso aos dados (pandas) — loader de CSV com agregação em memória.

No 1º acesso, carrega `tensor_concentracao.csv` (concentração + qualidade de rede) e
`assinantes.csv` (renda), agrega por município/cluster/período e cruza a renda. O
resultado fica cacheado em memória; `buscar()` filtra esse DataFrame.

Interface estável: `buscar(regiao, limite) -> list[dict]`. Quando o `scripts/ingest.py`
gerar o Parquet, basta trocar o `_carregar()` por `pd.read_parquet(...)` — o resto não muda.
"""

import math
import unicodedata
from pathlib import Path

import pandas as pd

DATASET = Path(__file__).resolve().parents[2] / "dataset"
CONCENTRACAO_CSV = DATASET / "tensor_concentracao.csv"
ASSINANTES_CSV = DATASET / "assinantes.csv"
OD_CSV = DATASET / "tensor_od.csv"  # matriz origem→destino por cluster (mobilidade)

_df: pd.DataFrame | None = None
_mob: pd.DataFrame | None = None


def _normalizar(s: str) -> str:
    """minúsculo, sem acento, '_'→' ' — pra casar 'São José' com 'Sao Jose'/'SAO_JOSE_*'."""
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode()
    return s.lower().replace("_", " ")


def _carregar() -> pd.DataFrame:
    """Lê os CSV e devolve o agregado por município/cluster/período (com renda)."""
    # 1) concentração + qualidade de rede por zona/período. O CSV é por (antena, dia, período);
    # um cluster tem várias antenas (mediana 6, até 13), então a forma de agregar importa.
    conc = pd.read_csv(CONCENTRACAO_CSV, dtype={"ecgi": str})

    # 1a) taxas (congestionamento, drop): média PONDERADA por n_usuarios — uma antena quase
    # vazia não pode pesar igual a uma lotada. Vetorizado: soma(taxa*usuários)/soma(usuários).
    conc["_w_cong"] = conc["congestionamento_medio"] * conc["n_usuarios"]
    conc["_w_drop"] = conc["drop_pct_medio"] * conc["n_usuarios"]
    agregado = conc.groupby(["municipio", "cluster", "periodo"], as_index=False).agg(
        _soma_cong=("_w_cong", "sum"),
        _soma_drop=("_w_drop", "sum"),
        _peso=("n_usuarios", "sum"),
        lat=("lat", "first"),
        lon=("lon", "first"),
    )
    peso = agregado["_peso"].replace(0, pd.NA)  # evita divisão por zero (zona sem usuários)
    agregado["congestionamento"] = agregado["_soma_cong"] / peso
    agregado["drop_rede"] = agregado["_soma_drop"] / peso

    # 1b) concentração: total de usuários da ZONA (soma entre antenas), média entre dias.
    # `mean(n_usuarios)` puro diluía o cluster pelo nº de antenas — subestimava zonas densas.
    por_dia = conc.groupby(["municipio", "cluster", "periodo", "day_date"], as_index=False).agg(
        usuarios=("n_usuarios", "sum")
    )
    conc_zona = por_dia.groupby(["municipio", "cluster", "periodo"], as_index=False).agg(
        concentracao=("usuarios", "mean")
    )
    agregado = agregado.merge(conc_zona, on=["municipio", "cluster", "periodo"], how="left")
    agregado = agregado.drop(columns=["_soma_cong", "_soma_drop", "_peso"])

    # 2) renda predominante por cluster (income_cluster A/B/C/D) — dado real de desigualdade
    assinantes = pd.read_csv(ASSINANTES_CSV)
    renda = (
        assinantes.groupby("home_cluster")["income_cluster"]
        .agg(lambda s: s.mode().iat[0] if not s.mode().empty else None)
        .rename("renda")
        .reset_index()
    )
    # join normalizado: os CSV divergem em acento (ex. SAO_JOSE_ROÇADO vs SAO_JOSE_ROCADO),
    # então casamos pela chave sem acento em vez do nome cru — senão a renda some silenciosamente.
    renda["_chave"] = renda["home_cluster"].map(_normalizar)
    agregado["_chave"] = agregado["cluster"].map(_normalizar)
    agregado = agregado.merge(renda.drop(columns=["home_cluster"]), on="_chave", how="left")
    agregado = agregado.drop(columns=["_chave"])

    # 3) arredonda pra ficar limpo no prompt/IA e no mapa
    agregado["concentracao"] = agregado["concentracao"].round().astype("int64")
    agregado["congestionamento"] = agregado["congestionamento"].round(3)
    agregado["drop_rede"] = agregado["drop_rede"].round(4)

    # coluna oculta de busca (município + cluster, normalizada)
    agregado["_busca"] = (agregado["municipio"] + " " + agregado["cluster"]).map(_normalizar)
    return agregado


def _dados() -> pd.DataFrame:
    global _df
    if _df is None:
        _df = _carregar() if CONCENTRACAO_CSV.exists() else pd.DataFrame()
    return _df


def _nativo(v):
    """Converte escalar numpy → Python nativo e NaN → None (serialização segura)."""
    item = v.item() if hasattr(v, "item") else v
    if isinstance(item, float) and math.isnan(item):
        return None
    return item


def buscar(regiao: str | None = None, limite: int = 50) -> list[dict]:
    """Linhas agregadas filtradas por município/cluster.

    Sem `regiao` (pergunta geral, ex. "onde há mais congestionamento?"), devolve o
    agregado completo — são ~96 linhas, cabem folgado no prompt, e dão à IA a visão
    total pra responder qualquer ranking sem o data layer ter que adivinhar a métrica.
    Com `regiao`, o filtro já reduz bastante; `limite` é só uma trava de segurança.
    """
    df = _dados()
    if df.empty:
        return []

    if regiao:
        out = df[df["_busca"].str.contains(_normalizar(regiao), regex=False)].head(limite)
    else:
        out = df

    registros = out.drop(columns=["_busca"]).to_dict("records")
    return [{k: _nativo(v) for k, v in r.items()} for r in registros]


# --------------------------------------------------------------------------- #
# Mobilidade (matriz origem→destino por cluster — tensor_od.csv)
# --------------------------------------------------------------------------- #
def _carregar_mobilidade() -> pd.DataFrame:
    """Lê o OD por cluster e devolve colunas limpas pro prompt/mapa (sem agregar)."""
    od = pd.read_csv(OD_CSV)
    cols = [
        "cluster_origem",
        "municipio_origem",
        "cluster_destino",
        "municipio_destino",
        "mesmo_cluster",
        "n_usuarios",
        "n_viagens",
        "dist_media_km",
        "periodo_predominante",
        "lat_origem",
        "lon_origem",
        "lat_destino",
        "lon_destino",
    ]
    mob = od[cols].round(
        {"dist_media_km": 2, "lat_origem": 4, "lon_origem": 4, "lat_destino": 4, "lon_destino": 4}
    )
    # coluna oculta de busca: casa origem OU destino (município ou cluster), sem acento
    mob["_busca"] = (
        mob["municipio_origem"]
        + " "
        + mob["cluster_origem"]
        + " "
        + mob["municipio_destino"]
        + " "
        + mob["cluster_destino"]
    ).map(_normalizar)
    return mob


def _mobilidade() -> pd.DataFrame:
    global _mob
    if _mob is None:
        _mob = _carregar_mobilidade() if OD_CSV.exists() else pd.DataFrame()
    return _mob


def buscar_mobilidade(regiao: str | None = None, limite: int = 80) -> list[dict]:
    """Fluxos origem→destino por cluster.

    Com `regiao`, devolve todos os fluxos que tocam a zona (origem OU destino). Sem
    `regiao`, devolve os `limite` maiores fluxos por nº de viagens — o OD tem 506 pares
    e mandar tudo em toda pergunta pesaria no prompt; os maiores fluxos são o que
    responde "para onde as pessoas mais vão". Trava de segurança em `limite` quando filtrado.
    """
    df = _mobilidade()
    if df.empty:
        return []

    if regiao:
        out = df[df["_busca"].str.contains(_normalizar(regiao), regex=False)].head(limite)
    else:
        out = df.sort_values("n_viagens", ascending=False).head(limite)

    registros = out.drop(columns=["_busca"]).to_dict("records")
    return [{k: _nativo(v) for k, v in r.items()} for r in registros]
