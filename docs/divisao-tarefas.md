# 👥 Divisão de Tarefas — 6 frentes

Time de 6 pessoas iniciantes. As frentes são **paralelas**: o que destrava o paralelismo é
o [contrato-integracao.md](./contrato-integracao.md). Enquanto a IA real não existe, o
backend devolve resposta **mockada** no formato do contrato — então todas as telas já funcionam.

## Frentes

| # | Frente | Stack | Entrega do Dia 1 | Depois |
|---|---|---|---|---|
| 1 | **Dados / Pipeline** | Python, pandas | Baixar zip → `backend/dataset/`, rodar `ingest.py` → `concentracao.parquet` | Cruzamento concentração × qualidade de rede × renda; fontes plugáveis |
| 2 | **Backend / API** | Python, FastAPI, Pydantic | `/health`, `/mapa` e `/dados` com **mock** no formato do contrato | Conectar rotas ao `data_service` real |
| 3 | **Agente de IA** | Python | `MockProvider` redigindo o "paper" a partir de dados | Plugar o `GeminiProvider` (SDK google-genai) |
| 4 | **Mapa** | React, react-leaflet | `MapaRegioes` com Leaflet + 1 município de Floripa (estático) | Consumir `/mapa`; cores por indicador |
| 5 | **Consulta / UI / PDF** | React, TS | `AIQueryBar` + card `ResultadoPaper` + responsivo | Consumir `/dados`; exportar PDF (react-to-print) |
| 6 | **Infra / Deploy / Docs** | Render, Git | `render.yaml`, `.env.example`, CORS, README; conectar front↔back | Deploy contínuo; manter docs atualizadas |

> Frentes 1–3 são Python (backend); 4–5 são React (frontend); 6 costura tudo.
> Quem sabe Java pega Python/TS rápido — a sintaxe é próxima.

## Sequência sugerida (Dia 1)

1. **Todos:** reunião de alinhamento + ler `docs/` (esp. contrato e dataset).
2. **Frente 6:** criar `.env` a partir do exemplo; subir esqueleto front + back rodando localmente.
3. **Frente 1:** explorar o dataset Vísent (entender os dados é o passo 1 do desafio).
4. **Frente 2:** `/dados` e `/mapa` devolvendo **mock** → destrava as frentes 4 e 5.
5. **Frentes 4 e 5:** telas consumindo o mock.

## Regras de colaboração

- **Branches por frente:** `feat/pipeline`, `feat/api`, `feat/ia`, `feat/mapa`, `feat/ui`, `feat/infra`.
- **PR pequeno e frequente** → mais fácil revisar e menos conflito.
- **Nunca commitar** `.env`, chaves, ou os CSVs grandes do Vísent.
- Mudou o contrato? Avise o time e atualize `docs/contrato-integracao.md` **antes**.

## Marcos (até o Demo Day 10/07/2026)

- [ ] **Dia 1** — Setup + contrato + mock funcionando ponta a ponta
- [ ] **Semana 1** — `/dados` e `/mapa` com dado real do Vísent; telas integradas
- [ ] **Semana 2** — Deploy no Render; PDF; provedor de IA real plugado
- [ ] **Semana 3** — Indicadores complementares + polish de UX
- [ ] **Reta final** — Ensaio do pitch + manter serviço acordado para a demo
