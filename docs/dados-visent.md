# 📊 Dataset Vísent CDRView — o que usamos no MVP

**Fonte:** https://github.com/wongola-bit/appbit (pasta `dataset-visent/`)
**Região:** Região Metropolitana de **Florianópolis (SC, Brasil)** — 132 ERBs reais da Claro
(coordenadas via Anatel), distribuídas em **27 clusters** (zonas) e **7 municípios**
(Florianópolis, São José, Palhoça, Biguaçu, Santo Amaro, Gov. Celso Ramos, Antônio Carlos).
Dados sintéticos sobre antenas reais. Período: 15 dias, 2026.
**Schemas confirmados pelo `CDRView_AppBiT_TechnicalReference_v2.docx`.**

---

## ⚠️ Regra de ouro: NÃO usar os arquivos gigantes

| Arquivo | Tamanho | Usar no MVP? |
|---|---|---|
| `tensor_mobilidade.csv` | **2,7 GB** (16,8M eventos) | ❌ NÃO — não versionar, não subir em banco |
| `tensor_sequencias.csv` | **915 MB** | ❌ NÃO no MVP |
| `bases_hackathon_bit.zip` | **~3 MB** | ✅ **SIM — é daqui que vem tudo** |

Os arquivos de GB **devem ficar no `.gitignore`**. O ouro do MVP está no zip de 3 MB.

## Tabelas agregadas (dentro do zip) — estas sim

| Arquivo | Linhas | Usamos para |
|---|---|---|
| `tensor_concentracao.csv` | 7.920 | **Indicador-núcleo** — concentração (`n_usuarios`) + qualidade de rede + lat/lon |
| `assinantes.csv` | 200.000 | Demografia REAL — inclui **faixa de renda** (`income_cluster`); agregar por cluster |
| `antenas_flp.csv` | 132 | Catálogo de antenas (`ecgi, cluster, municipio, lat, lon`) — opcional |
| `tensor_od.csv` | 506 | Fluxo origem-destino entre clusters (zonas) |
| `trajetos_comuns.csv` | 506 | **= `tensor_od`, porém K-anonimizado (K=3)** — versão pública (LGPD) |
| `tensor_fluxo_vias.csv` | 17.292 | Fluxo entre pares de **antenas** (corredores/vias) — mapa de fluxo fino |
| `tensor_tempo_deslocamento.csv` | 462 | Distância/tempo entre clusters (média, p25, p75) |
| `sumario_kanon.csv` | 6 | Relatório de privacidade (K=3) — metadados, não é dado analítico |

## Schemas reais (confirmados pelo Technical Reference v2)

### `tensor_concentracao.csv` (7.920 linhas) — auto-suficiente pro MVP
Já traz lat/lon e cluster/município → **não precisa juntar com `antenas_flp` pro mapa**.
```
ecgi, cluster, municipio, day_date, periodo, n_usuarios, n_sessoes,
download_bytes, upload_bytes, dur_media_s, drop_pct_medio,
congestionamento_medio, chamadas_total, mensagens_total, lat, lon
```
- **Concentração de pessoas = `n_usuarios`** (usuários distintos por antena/dia/período).
- **Qualidade/cobertura de rede = `congestionamento_medio` [0–1]** e **`drop_pct_medio`**
  (quanto maior, pior a rede).
- `periodo`: MADRUGADA/MANHA/TARDE/NOITE · `day_date`: 15 dias.

### `antenas_flp.csv` (132) — catálogo (opcional no MVP)
`ecgi, cluster, municipio, lat, lon`. Como o `tensor_concentracao` já tem lat/lon, vira opcional.

### `assinantes.csv` (200.000) — demografia REAL 🎯
`assinante_hash, home_cluster, home_municipio, income_cluster (A/B/C/D), age_group,
mobility_pattern, flag_flagship`.
- **`income_cluster` (faixa de renda A/B/C/D)** → cruzar concentração × renda e achar zonas de
  **baixa renda** com muita gente e rede ruim. **Dado real de desigualdade** — reduz mock.
- Sempre agregar por `home_cluster`/`home_municipio` (nunca usar registro individual).

### `tensor_od.csv` (~500) — fluxo entre zonas (opcional)
Origem-destino por cluster: `cluster_origem/destino`, `n_usuarios`, `n_viagens`, lat/lon dos centroides.

> ⚠️ **Cobertura como 3G/4G/5G:** a geração (`rat_type`: NR=5G / LTE=4G / WCDMA=3G) só existe no
> `tensor_mobilidade.csv` (2,7 GB), por sessão — **não** nas tabelas pequenas. No MVP usamos os
> proxies de qualidade do `tensor_concentracao` (`congestionamento_medio`, `drop_pct_medio`).
> A geração só entra se alguém **pré-agregar o `rat_type` offline em chunks** → tabelinha `ecgi → geração`.

> 🐍 **Dica pandas:** sempre `dtype={"ecgi": str}` — senão o id da antena vira float e corrompe.

## Períodos do dia
| Período | Horas |
|---|---|
| MADRUGADA | 00–06 |
| MANHA | 06–12 |
| TARDE | 12–18 |
| NOITE | 18–00 |

## O que é dado real vs. enriquecido

| Indicador | Coluna / origem | Confiança MVP |
|---|---|---|
| Concentração de pessoas | `n_usuarios` (Vísent, real) | 🟢 Alta |
| Qualidade/cobertura de rede | `congestionamento_medio` / `drop_pct_medio` (Vísent, real) | 🟢 Alta |
| Faixa de renda por zona | `income_cluster` A/B/C/D (Vísent, real) | 🟢 Alta |
| Concentração × rede ruim × baixa renda | cruzamento (Vísent, real) | 🟢 Alta |
| Geração 3G/4G/5G | `rat_type` no arquivo de 2,7 GB (pré-agregar offline) | 🟡 Opcional |
| Emprego / formação / saúde mental | Enriquecido/mock por município | 🟡 Média — rotular como complementar |

**Escopo recomendado do MVP:** travar o indicador-núcleo **concentração × qualidade de rede
× faixa de renda** (100% Vísent, dado real) — é o que melhor conta a história de inclusão.
Emprego/formação/saúde mental entram como camadas complementares rotuladas (mock por
município). Isso já cobre o requisito "mapa com ≥2 regiões e 1 indicador" com folga (são 7 municípios).

## Fontes públicas complementares (futuro, opcional)

Plugáveis pela arquitetura de fontes (ver [arquitetura.md](./arquitetura.md)):
- [IBGE](https://www.ibge.gov.br/), [DATASUS](https://datasus.saude.gov.br/),
  [IPEA — Atlas da Violência](https://www.ipea.gov.br/atlasviolencia/),
  [Brasil.io](https://brasil.io/), [HDX/OCHA](https://data.humdata.org/),
  [Meta Data for Good](https://dataforgood.facebook.com/).

## Como obter os dados localmente
1. Baixar `bases_hackathon_bit.zip` do repositório do dataset.
2. Extrair os CSVs em **`backend/dataset/`** (mínimo: `tensor_concentracao.csv` e
   `assinantes.csv`; opcionais: `antenas_flp.csv`, `tensor_od.csv`).
3. Rodar o pipeline (`python -m scripts.ingest`) → gera `backend/dataset/processed/concentracao.parquet`.
4. **Nunca** trazer os tensores de GB (`tensor_mobilidade`, `tensor_sequencias`) — ver `.gitignore`.
