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
