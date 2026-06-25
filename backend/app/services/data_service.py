"""Acesso aos dados (pandas). Carrega o Parquet do pipeline e filtra em memória.

Sem mock: enquanto o `scripts/ingest.py` não gerar o Parquet, `buscar()` devolve [].
"""
from pathlib import Path
import pandas as pd

# app/services/data_service.py -> parents[2] = backend/
PARQUET = Path(__file__).resolve().parents[2] / "dataset" / "processed" / "concentracao.parquet"

_df: pd.DataFrame | None = None


def _load() -> pd.DataFrame | None:
    global _df
    if _df is None and PARQUET.exists():
        _df = pd.read_parquet(PARQUET)
    return _df


def buscar(regiao: str | None = None, limite: int = 10) -> list[dict]:
    """Retorna as linhas relevantes (filtradas por município/cluster) como dicts."""
    df = _load()
    if df is None:
        return []  # sem dados até o pipeline gerar o Parquet

    out = df
    if regiao:
        r = regiao.lower()
        out = df[df["municipio"].str.lower().str.contains(r)
                 | df["cluster"].str.lower().str.contains(r)]
    return out.head(limite).to_dict("records")
