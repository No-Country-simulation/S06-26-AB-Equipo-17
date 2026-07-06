# 🏗️ Arquitetura

## Visão geral

```
┌──────────────────────┐     HTTP/JSON      ┌───────────────────────────┐
│   FRONTEND (PWA)      │  ───────────────▶  │      BACKEND (API)        │
│   React + Vite + TS   │                    │      Python + FastAPI     │
│                       │  ◀───────────────  │                           │
│  • ConsultaPage (IA)  │   resposta "paper" │  ┌──────────────────────┐ │
│  • MapaPage (Leaflet) │                    │  │  ai_service (prompt) │ │
│  • Export PDF         │                    │  │   → ai_gateway       │ │
└──────────────────────┘                    │  │     (Gemini)         │ │
                                             │  └──────────┬───────────┘ │
                                             │  ┌──────────▼───────────┐ │
                                             │  │  data_service        │ │
                                             │  │  (pandas + CSVs)     │ │
                                             │  └──────────┬───────────┘ │
                                             └─────────────┼─────────────┘
                                                           ▼
                                  backend/dataset/ (CSVs agregados do Vísent)
```

**Princípio central:** o frontend nunca fala com a IA diretamente. Ele chama a API; a API
filtra os dados reais e só então pede à IA que **redija** a resposta usando *apenas* esses dados.

## Stack

| Camada | Tecnologia | Observação |
|---|---|---|
| Frontend | **React + Vite + TypeScript** | PWA responsiva; `react-leaflet` para o mapa |
| Mapa | **Leaflet + OpenStreetMap** | Gratuito, **sem chave de API** |
| Backend | **Python 3.12 + FastAPI** | Docs automáticas em `/docs`; async |
| Validação | **Pydantic v2** | Garante o formato do "paper" na entrada e saída |
| Dados | **pandas** (DataFrame em memória) | Carrega no startup; ~8 mil linhas; só leitura |
| IA | **ai_service + ai_gateway** | service monta prompt; gateway = adapter Gemini (`GeminiGateway`, sem mock) |
| PDF | **@react-pdf/renderer** (frontend) | Gera o "paper" como Blob no cliente; entrega por ambiente (ADR-018) |
| Deploy | **Render** (2 serviços) | `web` (frontend estático) + `api` (uvicorn) |

## Por que os dados ficam em memória (e não num banco)

Os arquivos úteis do Vísent são **read-only** e têm poucos milhares de linhas (ver
[dados-visent.md](./dados-visent.md)). Carregar com **pandas** (DataFrame) no startup:

- ✅ **Zero fricção no Dia 1** — ninguém trava instalando/configurando Postgres
- ✅ Deploy instantâneo no Render
- ✅ Consultas em memória com pandas, sem servidor de banco

A camada `data_service` isola o acesso aos dados. Migrar para **Postgres** no futuro mexe
em **um arquivo só**, sem afetar rotas nem frontend. (O desafio pede arquitetura
"preparada para mais fontes" — isso é atendido pela abstração, não por um banco no MVP.)

## Fontes de dados plugáveis

```
data_service (app/services/dados/)
   ├─ concentracao.py   (núcleo, dado real — concentração × qualidade de rede × renda)
   ├─ mobilidade.py     (fluxos origem→destino — tensor_od)
   ├─ monitoramento.py  (bairros × antenas — /mapa/overview)
   └─ [futuro] IBGE / DATASUS / IPEA / Brasil.io (emprego/formação/saúde mental)
```

Cada conjunto é um módulo com a mesma interface (`buscar*()`, re-exportada no `__init__.py`
do pacote), então adicionar IBGE/DATASUS depois não quebra nada.

## Estrutura de pastas (atual)

```
appbit-17/
├── docs/                      ← você está aqui
├── skills/                    ← skills por área (frontend.md · backend.md) + MEMORIA.md
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   ├── dataset/               ← CSVs agregados do Vísent (tensores de GB no .gitignore)
│   ├── scripts/ingest.py      ← pipeline ETL (CSV → Parquet)  [a criar]
│   ├── tests/                 ← smoke tests
│   └── app/
│       ├── main.py            ← create_app(): CORS + router
│       ├── api/
│       │   ├── deps.py        ← injeção (get_ai_service)
│       │   └── v1/
│       │       ├── api.py     ← router mestre
│       │       └── endpoints/ ← health.py · dados.py · mapa/ (pacote: concentracao ·
│       │                        rede · mobilidade · overview)
│       ├── core/config.py     ← settings (Pydantic Settings)
│       ├── schemas/dados.py   ← DTOs Pydantic (contrato)
│       ├── services/          ← dados/ (pacote pandas) · ia/ (prompts + service)
│       └── gateways/          ← ai_gateway (Protocol) · gemini_gateway
├── frontend/
│   └── src/                   ← estrutura completa em skills/frontend.md
│       ├── pages/             ← SignInPage · MapPage · AnalyticsPage · ReportsPage
│       ├── features/          ← query-flow · notifications · settings
│       ├── components/        ← design system (pasta por componente) + ui/ (shadcn)
│       └── api/               ← client.ts (axios) · endpoints.ts · hooks/
└── render.yaml
```

### Camadas do backend (fluxo de uma requisição)

```
POST /api/v1/dados → endpoint → data_service.buscar() → ai_service.responder()
                                                    ├ monta o prompt (ancorado)
                                                    └ ai_gateway.gerar() → Gemini
                                                  → valida no RespostaPaper → JSON
```

- **endpoint** (`api/v1/endpoints`): só traduz HTTP ↔ chamada de serviço (fino).
- **services**: `data_service` (filtra com pandas) e `ai_service` (monta prompt + valida).
- **gateways**: a IA é um **adapter externo** — recebe `prompt + schema`, devolve JSON.
  Plugar outro LLM mexe **só aqui**. Sem mock (ADR-014): sem `AI_API_KEY`, o `ai_service`
  devolve um "paper" de baixa confiança (fallback, sem 500).

## Deploy (Render)

Dois serviços definidos em `render.yaml`:

1. **api** — Python Web Service: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. **web** — Static Site: build do Vite (`npm run build`) servindo `frontend/dist`
