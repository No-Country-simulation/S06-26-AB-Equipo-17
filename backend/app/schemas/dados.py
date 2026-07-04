"""Schemas Pydantic = o contrato da API (ver docs/contrato-integracao.md)."""

from typing import Literal

from pydantic import BaseModel, Field, field_validator

Idioma = Literal["pt", "es", "en"]


# ---------- Entrada ----------
class Filtros(BaseModel):
    regiao: str | None = None  # município ou cluster; None = todas
    indicador: str | None = None  # concentracao | qualidade_rede | renda | ...


class ConsultaRequest(BaseModel):
    consulta: str
    filtros: Filtros = Field(default_factory=Filtros)
    idioma: Idioma = "pt"  # pt | es | en (validado)

    @field_validator("idioma", mode="before")
    @classmethod
    def _normalizar_idioma(cls, v: object) -> object:
        # "PT", "pt-BR", "pt_BR" → "pt"; fora de pt/es/en → 422 (validação do Literal)
        if isinstance(v, str):
            return v.strip().lower().replace("_", "-").split("-")[0]
        return v


# ---------- Saída (o "mini-paper") ----------
class Evidencia(BaseModel):
    dado: str
    valor: str  # texto (a IA formata números como string)
    regiao: str | None = None
    periodo: str | None = None
    fonte: str


class Fonte(BaseModel):
    nome: str
    url: str | None = None
    tipo: str = "dataset"  # dataset | publica | enriquecida


class PontoMapa(BaseModel):
    regiao: str
    lat: float | None = None
    lng: float | None = None
    valor: float | None = None
    sem_dados: bool = False  # True = pin vermelho no mapa


class Visualizacao(BaseModel):
    tipo: str = "nenhuma"  # mapa | barra | nenhuma
    dados: list[PontoMapa] = Field(default_factory=list)


# ---------- Mapa (GET /mapa/*) ----------
class FluxoMapa(BaseModel):
    """Um fluxo origem→destino do OD (linha/seta no mapa + hover card)."""

    origem: str
    destino: str
    municipio_origem: str | None = None  # o OD tem ausentes reais
    municipio_destino: str | None = None
    lat_origem: float | None = None
    lng_origem: float | None = None
    lat_destino: float | None = None
    lng_destino: float | None = None
    viagens: int | None = None
    usuarios: int | None = None
    dist_km: float | None = None
    periodo: str | None = None  # período predominante do fluxo
    mesmo_cluster: bool | None = None  # fluxo interno (origem = destino no mapa)


class VisualizacaoFluxos(BaseModel):
    tipo: str = "fluxos"
    dados: list[FluxoMapa] = Field(default_factory=list)


class BairroOverview(BaseModel):
    """Um bairro do referencial: monitorado (com zonas do Vísent) ou vazio."""

    bairro: str
    monitorado: bool
    zonas: list[str] = Field(default_factory=list)  # vazio = sem monitoramento
    antenas: int = 0  # antenas fisicamente dentro do polígono do bairro


class ZonaForaReferencial(BaseModel):
    """Zona monitorada sem bairro no referencial (continente: São José/Palhoça/Biguaçu)."""

    zona: str
    municipio: str
    lat: float | None = None  # centroide das antenas da zona
    lng: float | None = None
    antenas: int = 0


class VisualizacaoOverview(BaseModel):
    tipo: str = "overview"
    total_antenas: int = 0
    dados: list[BairroOverview] = Field(default_factory=list)
    zonas_fora_referencial: list[ZonaForaReferencial] = Field(default_factory=list)


class RespostaPaper(BaseModel):
    afirmacao: str
    evidencias: list[Evidencia] = Field(default_factory=list)
    fontes: list[Fonte] = Field(default_factory=list)
    nivel_confianca: str = "media"  # alta | media | baixa
    visualizacao: Visualizacao | None = None
