"""Pipeline de ingestão Vísent CDRView: Extract → Profiling → Transform → Validate → Load.

Rodar a partir de backend/:  python -m scripts.ingest

Materializa o agregado (concentração × qualidade de rede × renda) em
dataset/processed/concentracao.parquet. A transformação é IMPORTADA de
app.services.dados.concentracao (fonte da verdade) — este script não duplica
regra de agregação; ele confere os brutos, valida o agregado e grava o Parquet.
Com o Parquet presente (e commitado), o data_service o carrega direto no
startup e pula a agregação; sem ele, agrega dos CSVs como antes.

Falhou uma checagem? O pipeline PARA com erro claro — melhor falhar no build
do que servir lixo. Desenho completo em docs/pipeline-dados.md.
"""

import os
from pathlib import Path

import pandas as pd

try:
    from app.services.dados.concentracao import (
        ASSINANTES_CSV,
        CONCENTRACAO_CSV,
        PROCESSED_PARQUET,
        _carregar,
    )
except ImportError as exc:  # rodou de outra pasta / sem -m
    raise SystemExit("Rode a partir de backend/:  python -m scripts.ingest") from exc

PERIODOS = {"MADRUGADA", "MANHA", "TARDE", "NOITE"}
# colunas que o data_service espera no agregado (inclui a coluna oculta de busca)
COLUNAS = {
    "municipio",
    "cluster",
    "periodo",
    "lat",
    "lon",
    "concentracao",
    "congestionamento",
    "drop_rede",
    "renda_baixa_pct",
    "_busca",
}


def _checar(ok: bool, msg: str) -> None:
    if not ok:
        raise SystemExit(f"❌ pipeline abortado: {msg}")


def extrair() -> None:
    """Extract: confere que os CSVs crus estão em dataset/ (extraídos do zip)."""
    faltando = [p.name for p in (CONCENTRACAO_CSV, ASSINANTES_CSV) if not p.exists()]
    _checar(
        not faltando,
        f"CSV ausente em {CONCENTRACAO_CSV.parent}: {', '.join(faltando)} — "
        "baixe o bases_hackathon_bit.zip (ver docs/dados-visent.md)",
    )


def perfilar() -> None:
    """Profiling: conferência rápida dos brutos (schemas já confirmados pelo Technical Reference)."""
    conc = pd.read_csv(CONCENTRACAO_CSV, dtype={"ecgi": str})
    assinantes = pd.read_csv(ASSINANTES_CSV, usecols=["home_cluster", "income_cluster"])
    _checar(len(conc) > 7_000, f"tensor_concentracao com poucas linhas ({len(conc)})")
    _checar(len(assinantes) > 100_000, f"assinantes com poucas linhas ({len(assinantes)})")
    periodos = set(conc["periodo"].unique())
    _checar(periodos <= PERIODOS, f"períodos inesperados no bruto: {periodos - PERIODOS}")
    _checar(conc["n_usuarios"].notna().all(), "n_usuarios nulo no tensor_concentracao")
    print(f"  tensor_concentracao: {len(conc):,} linhas · assinantes: {len(assinantes):,} linhas")


def transformar() -> pd.DataFrame:
    """Transform: mesma agregação do data_service (concentração = soma entre antenas →
    média entre dias; taxas ponderadas por n_usuarios; renda_baixa_pct com join normalizado)."""
    return _carregar()


def validar(agregado: pd.DataFrame) -> None:
    """Validate: checagens de qualidade do agregado (docs/pipeline-dados.md, Etapa 4)."""
    _checar(not agregado.empty, "agregado vazio")
    _checar(
        COLUNAS <= set(agregado.columns), f"colunas faltando: {COLUNAS - set(agregado.columns)}"
    )
    for col in ("concentracao", "cluster", "periodo"):
        _checar(agregado[col].notna().all(), f"nulos em `{col}`")
    _checar(
        not agregado.duplicated(["municipio", "cluster", "periodo"]).any(), "zona×período duplicado"
    )
    periodos = set(agregado["periodo"].unique())
    _checar(periodos <= PERIODOS, f"períodos inválidos: {periodos - PERIODOS}")
    _checar(agregado["lat"].between(-28.0, -27.2).all(), "lat fora da Grande Florianópolis")
    _checar(agregado["lon"].between(-48.8, -48.3).all(), "lon fora da Grande Florianópolis")
    renda = agregado["renda_baixa_pct"]
    _checar(renda.dropna().between(0, 100).all(), "renda_baixa_pct fora de 0–100")
    _checar(
        renda.notna().mean() > 0.9, "join de renda perdeu zonas demais (chave normalizada quebrou?)"
    )


def gravar(agregado: pd.DataFrame, destino: Path = PROCESSED_PARQUET) -> Path:
    """Load: grava o Parquet que o data_service carrega no startup."""
    destino.parent.mkdir(parents=True, exist_ok=True)
    agregado.to_parquet(destino, index=False)
    return destino


def main(destino: Path = PROCESSED_PARQUET) -> None:
    print("→ Extract: conferindo CSVs crus em dataset/")
    extrair()
    print("→ Profiling: conferência rápida dos brutos")
    perfilar()
    print("→ Transform: agregação por município/cluster/período (regras do data_service)")
    agregado = transformar()
    print(f"  agregado: {len(agregado)} linhas × {len(agregado.columns)} colunas")
    print("→ Validate: checagens de qualidade")
    validar(agregado)
    print("→ Load: gravando Parquet")
    caminho = gravar(agregado, destino)
    # relpath (e não Path.relative_to): destino pode estar fora do cwd (ex.: tmp nos testes)
    print(
        f"OK — {len(agregado)} linhas em {os.path.relpath(caminho)} ({caminho.stat().st_size / 1024:.0f} kB)"
    )


if __name__ == "__main__":
    main()
