"""Monitoramento — quais bairros do referencial têm cobertura do Vísent.

Cruza dois insumos no 1º acesso (cache): as antenas reais (`antenas_flp.csv`)
e o referencial de bairros (`bairros_flp.json` — MESMO GeoJSON OSM do front,
admin_level=10, 56 bairros de Florianópolis; pra atualizar, regenerar via
Overpass — receita em skills/frontend.md — e copiar pros DOIS lugares).

O join zona→bairro parte do híbrido de `frontend/.../MapPage/coverage.ts`
(mudou lá → revisar aqui):
 1. zona sem NENHUMA antena dentro do referencial é do continente
    (São José/Palhoça/Biguaçu) → vai pra "fora do referencial" ANTES do match
    de nome (senão SAO_JOSE_CENTRO casaria o bairro Centro de Floripa);
 2. dentro do referencial, a zona cobre a UNIÃO de: bairros que casam por
    NOME normalizado + bairros que CONTÊM alguma antena dela. ⚠️ Difere do
    front de propósito: lá nome VENCE o espacial (atribuição de KPI — evita
    dar o valor da zona ao vizinho); aqui a pergunta é PRESENÇA de
    monitoramento, e bairro com antena dentro está monitorado por definição
    (senão o mapa pintaria "sem monitoramento" em cima de uma antena).
"""

import json
from functools import lru_cache

import pandas as pd

from app.services.dados.base import DATASET, normalizar

ANTENAS_CSV = DATASET / "antenas_flp.csv"
BAIRROS_GEOJSON = DATASET / "bairros_flp.json"

# palavras vazias ignoradas na comparação de nomes (igual ao front)
_STOPWORDS = {"da", "de", "do", "das", "dos"}


def _tokens(nome: str) -> tuple[str, ...]:
    """'Lagoa da Conceição' | 'LAGOA_CONCEICAO' → ('lagoa', 'conceicao')."""
    return tuple(t for t in normalizar(nome).split() if t not in _STOPWORDS)


def _nomes_casam(zona: tuple[str, ...], bairro: tuple[str, ...]) -> bool:
    """Match nas duas direções: zona é PREFIXO do bairro (INGLESES casa
    'Ingleses do Rio Vermelho') OU bairro é trecho CONTÍGUO da zona
    (ESTREITO_CAPOEIRAS casa 'Estreito' E 'Capoeiras')."""
    zona_e_prefixo = bairro[: len(zona)] == zona
    bairro_na_zona = any(
        zona[i : i + len(bairro)] == bairro for i in range(len(zona) - len(bairro) + 1)
    )
    return zona_e_prefixo or bairro_na_zona


def _no_anel(lng: float, lat: float, anel: list) -> bool:
    """Ray casting: ponto dentro de um anel do GeoJSON (coordenadas [lng, lat])."""
    dentro = False
    j = len(anel) - 1
    for i in range(len(anel)):
        xi, yi = anel[i][0], anel[i][1]
        xj, yj = anel[j][0], anel[j][1]
        if (yi > lat) != (yj > lat) and lng < (xj - xi) * (lat - yi) / (yj - yi) + xi:
            dentro = not dentro
        j = i
    return dentro


def _na_geometria(lng: float, lat: float, geometria: dict) -> bool:
    """Dentro da geometria (anel externo sim, buracos não)."""
    poligonos = (
        [geometria["coordinates"]] if geometria["type"] == "Polygon" else geometria["coordinates"]
    )
    return any(
        _no_anel(lng, lat, aneis[0]) and not any(_no_anel(lng, lat, furo) for furo in aneis[1:])
        for aneis in poligonos
    )


@lru_cache(maxsize=1)
def _cruzamento() -> dict:
    if not (ANTENAS_CSV.exists() and BAIRROS_GEOJSON.exists()):
        return {"bairros": [], "zonas_fora": [], "total_antenas": 0}

    antenas = pd.read_csv(ANTENAS_CSV, dtype={"ecgi": str})
    geo = json.loads(BAIRROS_GEOJSON.read_text())
    bairros = [
        {
            "nome": f["properties"]["name"],
            "geometria": g,
            "tokens": _tokens(f["properties"]["name"]),
        }
        for f in geo["features"]
        if f["properties"].get("name")
        and (g := f["geometry"])["type"] in ("Polygon", "MultiPolygon")
    ]

    # cada antena pertence a no máximo 1 bairro (None = continente, fora do referencial)
    antenas["bairro"] = [
        next((b["nome"] for b in bairros if _na_geometria(a.lon, a.lat, b["geometria"])), None)
        for a in antenas.itertuples()
    ]
    antenas_no_bairro = antenas["bairro"].value_counts()

    zonas_do_bairro: dict[str, list[str]] = {b["nome"]: [] for b in bairros}
    zonas_fora: list[dict] = []
    for zona, grupo in antenas.groupby("cluster"):
        espacial = sorted(set(grupo["bairro"].dropna()))
        if not espacial:  # gate do continente — antes do match de nome
            zonas_fora.append(
                {
                    "zona": zona,
                    "municipio": grupo["municipio"].mode().iat[0],
                    "lat": round(float(grupo["lat"].mean()), 4),
                    "lng": round(float(grupo["lon"].mean()), 4),
                    "antenas": len(grupo),
                }
            )
            continue
        tokens_zona = _tokens(zona)
        por_nome = [b["nome"] for b in bairros if _nomes_casam(tokens_zona, b["tokens"])]
        for nome in sorted(set(por_nome) | set(espacial)):
            zonas_do_bairro[nome].append(zona)

    linhas = [
        {
            "bairro": b["nome"],
            "monitorado": bool(zonas_do_bairro[b["nome"]]),
            "zonas": sorted(zonas_do_bairro[b["nome"]]),
            "antenas": int(antenas_no_bairro.get(b["nome"], 0)),
        }
        for b in bairros
    ]
    return {
        "bairros": sorted(linhas, key=lambda linha: linha["bairro"]),
        "zonas_fora": sorted(zonas_fora, key=lambda z: z["zona"]),
        "total_antenas": len(antenas),
    }


def buscar_monitoramento() -> dict:
    """Cruzamento pronto pro overview: TODOS os bairros do referencial (os sem
    monitoramento vão vazios — `monitorado=False`, `zonas=[]`) + zonas
    monitoradas fora do referencial (continente) + total de antenas."""
    return _cruzamento()
