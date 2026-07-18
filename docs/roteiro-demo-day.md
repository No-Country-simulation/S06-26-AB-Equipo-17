# 🎤 Roteiro do Demo Day — App BiT (Equipo 17)

> **Demo Day: 10/07/2026** · Pitch de **até 5 min, em PORTUGUÊS (pt-BR)** · Estrutura: 2 slides
> lidos (dor + solução) → demo ao vivo do site → tração → pedido (QR).
> **Total falado: 554 palavras (+25 da linha reserva, só se a IA demorar) ≈ 4:16–4:27 a 130 ppm
> + ~30 s de interação não coberta pela fala ≈ 4:46–4:57** (folga de 3–14 s; o corte seguro rende +6 s).
> Falante nativo tende a 140+ ppm → na prática sobra mais folga que o papel indica.
> ⚠️ A consulta à IA leva **15–30 s com o serviço QUENTE** (frio chega a ~36 s — ver
> [checklist](#checklist-de-palco-30-10-min-antes)); a carga é coberta por fala (explicação técnica + linha reserva).
> _Traduzido do espanhol em 2026-07-07 (apresentação confirmada em português) + adições: frase do
> selo de confiança na demo e checklist de palco._

**Como usar este roteiro:**
- O que está `[entre colchetes]` é ação/palco — **não se lê em voz alta** (não conta palavra).
- Ritmo de referência (conservador): **130 palavras/min**.
- Decorar por bloco; cada bloco tem contagem e tempo próprios. Se estourar o tempo, o corte
  seguro é a frase "Brasil/Angola" da Tração.

---

## SLIDE 1 — A Dor · 58 palavras · ~27 s

**No slide (poucas palavras):**
> **As políticas públicas chegam tarde.**
> · Dados dispersos que não se cruzam · Sem mapa das desigualdades
> · Consultar exige SQL · Decisões por intuição

**Guion (decorar):**

> Olá, somos a Equipe 17. Como um gestor público decide onde investir em inclusão digital?
> Hoje, com intuição. Os dados existem, mas estão dispersos em fontes que não se cruzam, sem
> visualização geográfica, e consultá-los exige saber SQL. Resultado: as políticas chegam
> tarde, aos lugares errados, e a desigualdade se aprofunda antes que alguém a veja num mapa.

---

## SLIDE 2 — A Solução · 113 palavras · ~52 s

**No slide:**
> **App BiT — Painel de Dados Públicos com IA**
> Pergunta em linguagem natural → **mini-paper**: afirmação + evidências + fontes + nível de confiança → PDF
> IA **ancorada** em dados reais (Vísent CDRView, 132 antenas) · PWA · PT/ES/EN

**Guion:**

> Por isso criamos o App BiT: um painel de dados públicos com inteligência artificial.
> Pensem na Carla, coordenadora de inclusão digital. Ela não escreve SQL — simplesmente
> pergunta, na língua dela: "Onde há muita gente com cobertura de rede ruim?". E a IA
> responde com um mini-paper: uma afirmação, as evidências com números reais, as fontes
> citadas e o nível de confiança. Exportável em PDF para levar à reunião do Conselho.
>
> E por que confiar? Porque a IA está ancorada em dados reais — o dataset Vísent CDRView,
> 132 antenas reais de Florianópolis — e nunca inventa um número. Na demo eu mostro como.
> Dashboards mostram dados; o App BiT entrega a decisão fundamentada e citável.

---

## DEMO AO VIVO (no site) · 204 palavras (+25 reserva) · ~2 min com a carga da IA

**Roteiro de tela:** app já aberta no mapa em **pt-BR** (tema *Visão geral*) → filtro *Cobertura
de rede* → filtro *Mobilidade* → barra de IA → pergunta → paper → Exportar PDF → fechar
**citando as seções mockadas como roadmap**. **Não abrir Analytics/Reports** (dados de exemplo) —
elas são *citadas* de propósito no encerramento, com enquadramento honesto ("dados de exemplo…
rota do produto"); opcional abrir o sino de notificações por ~2 s enquanto fala.

**Guion:**

> `[App aberta no mapa, tema "Visão geral"]`
> Este é o App BiT, ao vivo, instalável no celular. Este é o mapa de Florianópolis: 56
> bairros, e cada pin indica se o bairro está monitorado — no total, 132 antenas reais e em vermelho, as zonas sem dados.
>
> `[Trocar filtro para "Cobertura de rede"]`
> Troco o filtro: qualidade de rede por zona, com o congestionamento medido.
>
> `[Trocar filtro para "Mobilidade"]`
> E aqui, mobilidade: como as pessoas se movem entre as zonas.
>
> Agora, a pergunta da Carla.
> `[Clicar na barra de IA e digitar:]`
> "Onde há concentração de pessoas mas cobertura de rede precária?"
>
> `[Enviar. A consulta leva 15–30 s — a explicação técnica (~20 s) cobre o início; se o
> resultado aparecer antes de terminar, seguir falando e só então apresentá-lo:]`
> Enquanto carrega, o segredo técnico: o frontend nunca fala com a IA. Nosso endpoint
> recebe a pergunta, filtra só os dados relevantes do dataset e os envia à IA com formato
> obrigatório. Recebemos a resposta estruturada — redigida unicamente com esses dados.
>
> `[LINHA RESERVA (~12 s) — falar SÓ SE ainda estiver carregando:]`
> Essa espera é o preço de uma resposta verificada — não uma frase pré-montada. E ela chega
> no idioma que você escolher: português, espanhol ou inglês.
>
> `[Apresentar o resultado na tela]`
> E aqui está o mini-paper: afirmação, evidências com valores, fontes e nível de confiança.
> Reparem no selo de confiança: quando os dados não bastam, a IA avisa — em vez de fingir
> certeza.
>
> `[Clicar em Exportar]`
> E com um clique, o PDF pronto para a reunião. Tudo isso saiu da API ao vivo.
>
> `[Apontar para a sidebar (notificações/relatórios/alertas); opcional: abrir o sino de
> notificações por ~2 s enquanto fala]`
> E as seções que eu não abri — notificações, relatórios, alertas — já estão desenhadas com
> dados de exemplo: são a rota do produto. Imaginem alertas automáticos quando um indicador
> cai abaixo de um limiar.

> ⚠️ **Prepare-se para o selo "confiança média/baixa"**: a pergunta da demo cruza duas métricas
> e o congestionamento é quase uniforme no dataset — a IA vai declarar a diferença marginal e
> rebaixar a confiança. **É o comportamento desenhado** e a frase do guion transforma isso no
> diferencial. Ensaie com a pergunta exata e conheça a resposta que volta.

---

## TRAÇÃO E VALIDAÇÃO (falada sobre a app; slide opcional) · 121 palavras · ~56 s

**Guion:**

> Não é só teoria. Em três semanas, uma equipe de três pessoas construiu isto: os cinco
> requisitos do MVP, completos — pipeline de ingestão, IA em linguagem natural, mapa,
> interface responsiva e documentação. E somamos opcionais: exportação em PDF e o app
> completo em três idiomas — português, espanhol e inglês.
>
> Tudo roda sobre o dataset oficial Vísent CDRView: 132 antenas reais da Anatel, 27 zonas,
> 7 municípios e 200 mil assinantes anonimizados — privacidade por design.
>
> Está no ar, na nuvem, com integração contínua, e a arquitetura já está preparada para
> plugar novas fontes: IBGE, DATASUS, OMS. O mesmo painel serve para qualquer região — do
> Brasil ou de Angola. O que vocês veem hoje não é um protótipo de slides: é software
> funcionando.

---

## O PEDIDO — CTA (slide final com QR) · 58 palavras · ~27 s

**No slide:** logo + **QR code apontando para a URL do `appbit-web` no Render** + "Experimente agora".

**Guion:**

> Não viemos pedir investimento — viemos pedir perguntas. O App BiT está no ar agora mesmo:
> escaneiem o QR code, instalem, perguntem na sua língua e nos exportem seu primeiro paper.
> O feedback de vocês define as próximas fontes de dados. Porque os dados já existem; o que
> faltava era uma ferramenta para escutá-los. Somos a Equipe 17. Obrigado.

---

## Contagem oficial (exigência: pitch ≤ 5 min)

| Bloco | Palavras faladas | Tempo (130 ppm) |
|---|---|---|
| 1. A Dor (slide 1) | 58 | ~27 s |
| 2. A Solução (slide 2) | 113 | ~52 s |
| 3. Demo ao vivo | 204 (fala cobre ~20 s da carga; fecha com o roadmap das seções mockadas) | ~1 min 34 s |
| — linha reserva (só se a IA demorar) | +25 | +12 s |
| 4. Tração e validação | 121 | ~56 s |
| 5. O Pedido (CTA) | 58 | ~27 s |
| **Total** | **554 (pior caso 579)** | **~4:46–4:57 com interação** ✅ |

A carga da IA (15–30 s quente) fica **coberta por fala**: explicação técnica (~20 s) + linha
reserva (~12 s) = até ~32 s sem silêncio no palco.

---

## Checklist de palco (30–10 min antes)

- [ ] **Acordar o Render**: abrir o app e chamar o `/api/v1/health` ~10 min antes (cold start de
      ~30 s mataria o timing da demo).
- [ ] **1 consulta de aquecimento à IA** (valida a `AI_API_KEY` ao vivo e aquece a rota; a
      resposta quente medida é ~17 s).
- [ ] **App aberta no mapa**, tema *Visão geral*, idioma **pt-BR** (seletor no ⚙️ Configurações).
- [ ] **QR do slide final** apontando para a URL do `appbit-web` — testar com a câmera do celular.
- [ ] **Ensaiar com a pergunta exata da demo** e conhecer a resposta (selo de confiança
      média/baixa é o esperado — a frase do guion o transforma em argumento).
- [ ] **Plano B**: gravação de tela da consulta completa + 1 PDF exportado de antemão (se a
      rede do palco falhar, narra-se sobre a gravação sem mudar o guion).
- [ ] Fechar abas/notificações do navegador; modo não perturbe no laptop e no celular.

---

## Apêndice técnico — Arquitetura e Ingestão (Q&A / slide de apoio)

> **Não entra no pitch falado** (o orçamento de 554 palavras já está no limite). É a cola para as
> perguntas técnicas dos jurados e, se quiser, vira um slide de apoio deixado pronto no deck (não
> apresentado — só aberto se perguntarem). Fonte da verdade: `skills/backend.md`, `skills/frontend.md`
> e `docs/pipeline-dados.md`.

### Backend — camadas + ports & adapters

```
endpoint (FastAPI /api/v1) → services/dados → services/ia → gateways → Gemini
```

- **Camadas com dependência apontando para dentro**: `api/` (HTTP + injeção) → `schemas/` (contrato
  Pydantic) → `services/` (domínio) → `gateways/` (mundo externo).
- **A IA é um adapter trocável**: `ai_gateway.py` define o `Protocol` + factory; `gemini_gateway.py`
  é a implementação. Quem monta o prompt e valida a resposta é o `ai_service` — o gateway só chama.
  Trocar Gemini por outro provedor = trocar 1 arquivo.
- **Sem banco no MVP**: os dados do Vísent são agregados em memória (pandas) no startup, a partir
  de um Parquet validado (ver ingestão abaixo). Sem `AI_API_KEY` a API degrada com elegância
  (paper de confiança baixa, nunca 500).
- **Resposta anti-alucinação por construção**: structured output do Gemini
  (`response_schema=RespostaPaper`) + prompt `_SYSTEM` que obriga a copiar valores dos dados,
  declarar proxy e rebaixar a confiança em métrica quase uniforme.

**Frase pronta (se perguntarem "por que confiar na IA?"):** "O frontend nunca fala com a IA. O
backend filtra os dados, manda com formato obrigatório, valida a resposta e, se os dados não
bastam, a própria IA é instruída a dizer isso e rebaixar a confiança."

### Frontend — feature-based + camada de dados isolada

```
página → hook (api/hooks) → endpoint (api/endpoints.ts) → client (api/client.ts) → HTTP
```

- **Só `api/` fala HTTP**: 1 arquivo conhece o axios (`client.ts`), 1 função tipada por endpoint
  (mapeia DTO PT→EN); trocar a lib de HTTP = 1 arquivo.
- **Features autocontidas** (`query-flow`, `notifications`, `settings`, `pwa-install`): um hook
  orquestrador segura o estado; os componentes de tela são presentacionais (recebem tudo por props).
- **Design system próprio** (Tailwind v4 CSS-first, tokens do design) + shadcn/ui só nos
  interativos complexos; mapa Leaflet com 3 camadas de dado reais, **lazy por filtro**.
- **PWA instalável** + i18n em 3 idiomas + PDF gerado no cliente (`@react-pdf`, PWA-safe).

**Simetria que vale citar:** os dois lados isolam o mundo externo num único ponto trocável — no
backend o gateway (Gemini), no front o `client.ts` (axios).

### Pipeline de ingestão (`python -m scripts.ingest`)

Requisito do MVP, entregue como ETL de 5 etapas que **falha alto em vez de servir lixo** (qualquer
checagem reprovada aborta o build):

| Etapa | O que faz |
|---|---|
| **Extract** | Confere os CSVs crus do Vísent em `dataset/` |
| **Profiling** | Sanidade dos brutos: volumes mínimos, períodos válidos, sem nulos críticos |
| **Transform** | **Importa** a agregação do data_service (fonte única, zero duplicação): concentração = soma entre antenas → média entre dias; taxas ponderadas por usuários; join de renda normalizado |
| **Validate** | Qualidade do agregado: sem duplicata zona×período, lat/lon dentro da Grande Floripa, renda 0–100, join de renda cobrindo >90% das zonas |
| **Load** | Grava `dataset/processed/concentracao.parquet` (~9 kB), que a API prefere no startup |

- **Frescor garantido no CI**: `tests/test_ingest.py` acusa Parquet desatualizado se alguém mudar
  regra/CSV e esquecer de re-rodar o ingest.
- **Frase pronta (se perguntarem "e a qualidade dos dados?"):** "A ingestão valida antes de servir:
  se uma checagem falha — coordenada fora da cidade, join de renda perdendo zonas — o pipeline para
  no build. O dado que chega à IA já passou por esse funil, e o CI acusa se ele envelhecer."

---
