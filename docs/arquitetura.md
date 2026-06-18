# 🏗️ Arquitetura

## Visão geral

```
┌──────────────────────┐     HTTP/JSON      ┌───────────────────────────┐
│   FRONTEND (PWA)      │  ───────────────▶  │      BACKEND (API)        │
│   React + Vite + TS   │                    │      Python + FastAPI     │
│                       │  ◀───────────────  │                           │
│  • ConsultaPage (IA)  │   resposta "paper" │  ┌──────────────────────┐ │
│  • MapaPage (Leaflet) │                    │  │  ai.service          │ │
│  • Export PDF         │                    │  │   ├─ MockProvider    │ │
└──────────────────────┘                    │  │   └─ ClaudeProvider  │ │
                                             │  └──────────┬───────────┘ │
                                             │  ┌──────────▼───────────┐ │
                                             │  │  data.service        │ │
                                             │  │  (pandas em memória) │ │
                                             │  └──────────┬───────────┘ │
                                             └─────────────┼─────────────┘
                                                           ▼
                                            dataset/ (CSVs agregados Vísent)
```

**Princípio central:** o frontend nunca fala com a IA diretamente. Ele chama a API; a API
filtra os dados reais e só então pede à IA que **redija** a resposta usando *apenas* esses dados.

## Stack

| Camada | Tecnologia | Observação |
|---|---|---|
| Frontend | **React + Vite + TypeScript** | PWA responsiva; `react-leaflet` para o mapa |
| Mapa | **Leaflet + OpenStreetMap** | Gratuito, **sem chave de API** |
| Backend | **Python 3.11+ + FastAPI** | Docs automáticas em `/docs`; async |
| Validação | **Pydantic v2** | Garante o formato do "paper" na entrada e saída |
| Dados | **pandas** (CSVs em memória) | Carrega no startup; poucos milhares de linhas |
| IA | **Provider-agnostic** | `MockProvider` (default) → `ClaudeProvider` (real) |
| PDF | **react-to-print** (frontend) | Exporta o card de resultado |
| Deploy | **Render** (2 serviços) | `web` (frontend estático) + `api` (uvicorn) |

## Por que os dados ficam em memória (e não num banco)

Os arquivos úteis do Vísent são **read-only** e têm poucos milhares de linhas (ver
[dados-visent.md](./dados-visent.md)). Carregar com pandas no startup:

- ✅ **Zero fricção no Dia 1** — ninguém trava instalando/configurando Postgres
- ✅ Deploy instantâneo no Render
- ✅ Consultas em memória são rápidas

A camada `data.service` isola o acesso aos dados. Migrar para **Postgres** no futuro mexe
em **um arquivo só**, sem afetar rotas nem frontend. (O desafio pede arquitetura
"preparada para mais fontes" — isso é atendido pela abstração, não por um banco no MVP.)

## Fontes de dados plugáveis

```
data.service
   ├─ VisentSource      (núcleo, dado real — concentração × cobertura)
   ├─ SocialSource      (emprego/formação/saúde mental — mock por município no MVP)
   └─ [futuro] IBGE / DATASUS / IPEA / Brasil.io
```

Cada fonte implementa a mesma interface, então adicionar IBGE/DATASUS depois não quebra nada.

## Estrutura de pastas (alvo)

```
appbit-17/
├── docs/                      ← você está aqui
├── shared/                    ← contrato (referência; tipos espelhados em TS e Pydantic)
├── dataset/                   ← CSVs pequenos do Vísent (grandes ficam no .gitignore)
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py            ← FastAPI app + rotas
│   │   ├── models.py          ← schemas Pydantic (contrato)
│   │   ├── routers/           ← dados.py, mapa.py, health.py
│   │   ├── services/          ← ai_service.py, data_service.py
│   │   └── data/              ← loader.py + fontes plugáveis
│   └── scripts/ingest.py      ← pipeline: CSV → estruturas em memória
├── frontend/
│   └── src/
│       ├── pages/             ← ConsultaPage, MapaPage
│       ├── components/        ← AIQueryBar, ResultadoPaper, MapaRegioes
│       └── api/client.ts
└── render.yaml
```

## Deploy (Render)

Dois serviços definidos em `render.yaml`:

1. **api** — Python Web Service: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. **web** — Static Site: build do Vite (`npm run build`) servindo `frontend/dist`

⚠️ **Free tier dorme após inatividade** → cold start de ~30s. Manter "acordado" perto do
Demo Day. Variáveis sensíveis (chave de IA) só via painel de Environment do Render, **nunca**
no repositório.
