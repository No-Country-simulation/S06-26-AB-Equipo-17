"""Smoke test da API (rodar de backend/: pytest)."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_raiz_nao_da_404():
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["health"] == "/api/v1/health"


def test_mapa_devolve_pontos():
    # protege o refactor mapa.py → pacote mapa/ (rota e formato inalterados)
    r = client.get("/api/v1/mapa")
    assert r.status_code == 200
    body = r.json()
    assert body["tipo"] == "mapa"
    assert body["dados"], "esperava pins do agregado de concentração"
    assert {"regiao", "lat", "lng", "valor"} <= body["dados"][0].keys()


def test_mapa_mobilidade_devolve_fluxos():
    r = client.get("/api/v1/mapa/mobilidade")
    assert r.status_code == 200
    body = r.json()
    assert body["tipo"] == "fluxos"
    assert len(body["dados"]) == 80  # sem região: os 80 maiores fluxos por viagens
    fluxo = body["dados"][0]
    assert {
        "origem",
        "destino",
        "lat_origem",
        "lng_origem",
        "lat_destino",
        "lng_destino",
        "viagens",
    } <= fluxo.keys()


def test_mapa_mobilidade_filtra_por_regiao():
    r = client.get("/api/v1/mapa/mobilidade", params={"regiao": "Campeche"})
    assert r.status_code == 200
    dados = r.json()["dados"]
    assert dados
    assert all("campeche" in (f["origem"] + " " + f["destino"]).lower() for f in dados)


def test_mapa_rede_devolve_todos_os_pontos():
    # regressão: um return dentro do for fazia o endpoint devolver só 1 ponto
    r = client.get("/api/v1/mapa/rede")
    assert r.status_code == 200
    body = r.json()
    assert body["tipo"] == "mapa"
    assert len(body["dados"]) > 50  # agregado completo (~96 zonas/período)
    assert {"regiao", "lat", "lng", "valor", "sem_dados"} <= body["dados"][0].keys()


def test_mapa_overview_separa_monitorado_de_vazio():
    r = client.get("/api/v1/mapa/overview")
    assert r.status_code == 200
    body = r.json()
    assert body["tipo"] == "overview"
    assert body["total_antenas"] == 132
    assert len(body["dados"]) == 56  # referencial inteiro, monitorado ou não
    monitorados = [b for b in body["dados"] if b["monitorado"]]
    vazios = [b for b in body["dados"] if not b["monitorado"]]
    assert monitorados and vazios, "overview precisa das duas classes pro front separar"
    assert all(b["zonas"] for b in monitorados)
    assert all(b["zonas"] == [] for b in vazios)
    assert body["zonas_fora_referencial"], "zonas do continente têm que aparecer"
