"""Testes do pipeline de ingestão (scripts/ingest.py): ponta a ponta, validação e frescor."""

import pandas as pd
import pytest

from app.services.dados import concentracao
from scripts import ingest


def test_pipeline_ponta_a_ponta_gera_parquet_fiel(tmp_path):
    destino = tmp_path / "concentracao.parquet"
    ingest.main(destino=destino)
    # o Parquet materializa EXATAMENTE o agregado que o data_service monta dos CSVs
    pd.testing.assert_frame_equal(pd.read_parquet(destino), concentracao._carregar())


def test_validar_barra_agregado_quebrado():
    quebrado = concentracao._carregar()
    quebrado.loc[quebrado.index[0], "lat"] = -20.0  # fora do bounding box de Floripa
    with pytest.raises(SystemExit, match="lat fora"):
        ingest.validar(quebrado)


def test_validar_barra_coluna_faltando():
    sem_renda = concentracao._carregar().drop(columns=["renda_baixa_pct"])
    with pytest.raises(SystemExit, match="colunas faltando"):
        ingest.validar(sem_renda)


def test_data_service_prefere_o_parquet(tmp_path, monkeypatch):
    # grava um Parquet-marcador (4 linhas) e aponta o data_service pra ele
    marcador = concentracao._carregar().head(4)
    destino = tmp_path / "concentracao.parquet"
    marcador.to_parquet(destino, index=False)
    monkeypatch.setattr(concentracao, "PROCESSED_PARQUET", destino)
    concentracao._dados.cache_clear()
    try:
        assert len(concentracao.buscar()) == 4  # veio do Parquet, não dos CSVs (~96 linhas)
    finally:
        concentracao._dados.cache_clear()  # não poluir os outros testes com o marcador


def test_parquet_corrompido_cai_pros_csvs(tmp_path, monkeypatch):
    # Parquet ilegível não pode derrubar a API: _dados() deve agregar dos CSVs (fallback)
    corrompido = tmp_path / "concentracao.parquet"
    corrompido.write_bytes(b"isto nao e um parquet")
    monkeypatch.setattr(concentracao, "PROCESSED_PARQUET", corrompido)
    concentracao._dados.cache_clear()
    try:
        assert len(concentracao.buscar()) > 50  # agregado completo dos CSVs (~96 linhas)
    finally:
        concentracao._dados.cache_clear()


def test_parquet_commitado_nao_esta_desatualizado():
    # guarda de FRESCOR: se o Parquet versionado divergir da agregação atual dos CSVs
    # (mudou regra ou mudou CSV sem re-rodar o ingest), o CI acusa aqui.
    if not concentracao.PROCESSED_PARQUET.exists():
        pytest.skip("Parquet ainda não gerado — rode: python -m scripts.ingest")
    pd.testing.assert_frame_equal(
        pd.read_parquet(concentracao.PROCESSED_PARQUET), concentracao._carregar()
    )
