# 📚 Documentação — App BiT | Equipo 17 (Desafio B2G)

Documentação técnica do **Painel de Dados Públicos com IA**.

> Hackathon App BiT — Wongola / Black in Tech
> Desafio: **B2G — Painel de Dados Públicos**
> Demo Day: **10/07/2026**

## Índice

| Documento | O que contém |
|---|---|
| [arquitetura.md](./arquitetura.md) | Visão geral, stack escolhida, camadas e fluxo de dados |
| [decisoes-tecnicas.md](./decisoes-tecnicas.md) | Registro das decisões (ADR) — **por que** escolhemos cada coisa |
| [contrato-integracao.md](./contrato-integracao.md) | Contrato da API (`/dados`, `/mapa`) — destrava o trabalho em paralelo |
| [agente-ia.md](./agente-ia.md) | Design do agente de IA (service + gateway Gemini) e desafios de produção |
| [dados-visent.md](./dados-visent.md) | O que é o dataset Vísent CDRView e o que usamos no MVP |
| [pipeline-dados.md](./pipeline-dados.md) | Pipeline ETL de ingestão do Vísent (extract → transform → validate → load) |
| [deploy.md](./deploy.md) | Deploy do monorepo no Render (2 apps, 1 repo) + pegadinhas de CORS/Vite |
| [divisao-tarefas.md](./divisao-tarefas.md) | Divisão das 6 frentes de trabalho |
| [_tarefa1.md](./_tarefa1.md) | Documento de entrega da Tarefa 1 (resumo do projeto + links) |

## Resumo de 30 segundos

Uma **Web App responsiva (PWA)** onde gestores públicos (não-técnicos) fazem perguntas em
**linguagem natural** e recebem a resposta no formato de um **mini-paper**:
**afirmação → evidências com dados → fontes citadas → exportável em PDF**.

O núcleo é o dataset **Vísent CDRView** (concentração de pessoas × cobertura de rede na
Região Metropolitana de Florianópolis), com camadas sociais complementares (emprego,
formação, saúde mental) plugáveis.
