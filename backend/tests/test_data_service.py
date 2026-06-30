"""Testes do data_service: agregação de concentração e fluxos de mobilidade (OD)."""

import json

from app.services import data_service


def test_buscar_geral_devolve_agregado_completo():
    linhas = data_service.buscar(regiao=None)
    # sem filtro, manda tudo (pra IA ranquear); sem coluna interna vazando
    assert len(linhas) > 50
    assert "_busca" not in linhas[0]
    assert {"municipio", "cluster", "periodo", "concentracao", "congestionamento", "drop_rede"} <= (
        linhas[0].keys()
    )


def test_buscar_filtra_por_regiao_sem_acento():
    linhas = data_service.buscar(regiao="São José")
    assert linhas, "esperava ao menos uma zona de São José"
    # o match é pela chave normalizada (sem acento, '_'→' ')
    assert all(
        "sao jose" in data_service._normalizar(r["municipio"] + " " + r["cluster"]) for r in linhas
    )


def test_renda_casa_mesmo_com_diferenca_de_acento():
    # SAO_JOSE_ROÇADO (concentração) x SAO_JOSE_ROCADO (assinantes): join normalizado
    linhas = data_service.buscar(regiao="Roçado")
    assert linhas
    # renda agora é % das faixas baixas (C+D), não a categórica; tem que ter casado (não-nulo)
    assert all(isinstance(r["renda_baixa_pct"], float) for r in linhas)


def test_renda_baixa_pct_em_faixa_plausivel():
    linhas = data_service.buscar(regiao=None)
    pcts = [r["renda_baixa_pct"] for r in linhas]
    assert all(0 <= p <= 100 for p in pcts)
    # neste dataset a renda é quase uniforme: spread entre zonas deve ser pequeno
    assert max(pcts) - min(pcts) < 10


def test_buscar_serializa_em_json_nativo():
    # _nativo deve converter numpy → tipos nativos (senão json.dumps quebra)
    json.dumps(data_service.buscar(regiao=None))


def test_mobilidade_geral_traz_maiores_fluxos_ordenados():
    fluxos = data_service.buscar_mobilidade(regiao=None)
    assert len(fluxos) == 80  # limite default
    viagens = [f["n_viagens"] for f in fluxos]
    assert viagens == sorted(viagens, reverse=True)
    assert "_busca" not in fluxos[0]
    assert {"cluster_origem", "cluster_destino", "n_viagens", "dist_media_km"} <= fluxos[0].keys()


def test_mobilidade_filtra_origem_ou_destino():
    fluxos = data_service.buscar_mobilidade(regiao="Campeche")
    assert fluxos
    assert all(
        "campeche" in (f["cluster_origem"] + " " + f["cluster_destino"]).lower() for f in fluxos
    )


def test_mobilidade_serializa_em_json_nativo():
    json.dumps(data_service.buscar_mobilidade(regiao=None))
