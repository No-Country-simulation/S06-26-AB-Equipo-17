# 🔌 Contrato de Integração (API)

> Este é o documento **mais importante para o trabalho em paralelo**. Frontend e backend
> só precisam concordar com este contrato; depois cada frente trabalha de forma independente.
> A IA é **Gemini direto, sem mock** (ADR-014): sem `AI_API_KEY`, o backend responde um
> "paper" de baixa confiança **neste mesmo formato** (fallback, sem 500) — então o frontend,
> o mapa e o PDF funcionam mesmo sem a chave.

Base URL local: `http://localhost:8000`

> **Todos** os endpoints ficam sob **`/api/v1`**: `/health`, `/dados` e o pacote **`/mapa`** —
> `/mapa` (concentração) · `/mapa/rede` (qualidade de rede) · `/mapa/overview` (bairros × monitoramento) ·
> `/mapa/mobilidade` (fluxos OD). O `healthCheckPath` do Render aponta para `/api/v1/health`.

---

## `GET /api/v1/health`

Verifica se a API está no ar.

**Response 200**
```json
{ "status": "ok", "versao": "0.1.0" }
```

---

## `POST /api/v1/dados`

Consulta em linguagem natural. Retorna a resposta no formato **"mini-paper"**.

### Request
```json
{
  "consulta": "Onde há muita gente mas cobertura de rede ruim?",
  "filtros": {
    "regiao": "São José",        // opcional — município/cluster; null = todas
    "indicador": "concentracao"  // opcional — concentracao | qualidade_rede | renda | emprego | formacao | saude_mental
  },
  "idioma": "pt"                 // pt | es | en  (validado; default: pt)
}
```

> **`idioma`** é **validado** (`Literal["pt","es","en"]`) e **normalizado** no backend: `"PT"`,
> `"pt-BR"`, `"pt_BR"` viram `"pt"`. Valor fora de pt/es/en → **422**. A IA é instruída a
> **responder sempre no idioma pedido**, mesmo que a pergunta/dados estejam em outra língua.
>
> **`filtros.regiao`** casa **município OU cluster**, por *substring* **sem acento/underscore**
> (`"São José"` casa `SAO_JOSE_*`). **`filtros.indicador`** ainda **não filtra** os dados (uso futuro / dica à IA).

### Response 200 — o "mini-paper"
```json
{
  "afirmacao": "A zona central de São José concentra ~12.300 pessoas no período da tarde, mas a cobertura predominante é 3G — um gargalo para programas que dependem de acesso remoto.",
  "evidencias": [
    {
      "dado": "Concentração de pessoas (TARDE)",
      "valor": 12300,
      "regiao": "São José",
      "periodo": "TARDE",
      "fonte": "Vísent CDRView"
    },
    {
      "dado": "Cobertura de rede predominante",
      "valor": "3G",
      "regiao": "São José",
      "periodo": null,
      "fonte": "Anatel / Vísent CDRView"
    }
  ],
  "fontes": [
    { "nome": "Vísent CDRView", "url": "https://github.com/wongola-bit/appbit", "tipo": "dataset" },
    { "nome": "Anatel (antenas ERB)", "url": null, "tipo": "publica" }
  ],
  "nivel_confianca": "alta",     // alta | media | baixa
  "visualizacao": {
    "tipo": "mapa",              // mapa | barra | nenhuma
    "dados": [
      { "regiao": "São José", "lat": -27.61, "lng": -48.63, "valor": 12300 }
    ]
  }
}
```

### Mapeamento com o brief oficial
O brief pede `{ resposta_ia, dados, fontes }`. Nosso formato é uma **extensão** disso:
- `resposta_ia` → `afirmacao`
- `dados` → `evidencias`
- `fontes` → `fontes`
- extras nossos: `nivel_confianca`, `visualizacao` (para o PDF e o mapa)

### Regras de negócio
- A IA usa **somente** os dados retornados por `data_service`. Se não houver dado, devolve
  `afirmacao` dizendo "não há dados suficientes" e `nivel_confianca: "baixa"`. **Nunca inventa número.**
- Indicadores `emprego`/`formacao`/`saude_mental` no MVP são **complementares** → marcar
  `fonte` como enriquecida e tender a `nivel_confianca: "media"`.
- **Cobertura no MVP é um proxy:** o campo `cobertura_rede` deriva de `congestionamento_medio`/
  `drop_pct_medio` (Vísent, dado real), **não** da geração 3G/4G/5G (que está só no arquivo de
  2,7 GB). Já `renda` (`income_cluster` A/B/C/D) é dado real direto do Vísent.

### Erros
```json
// 422 — request inválido (Pydantic valida automaticamente)
{ "detail": [ { "loc": ["body", "consulta"], "msg": "field required" } ] }
```

---

## `GET /api/v1/mapa`

Concentração por zona monitorada (camada base). Devolve o schema **`Visualizacao`** (o mesmo do
`visualizacao` do POST /dados): ~4 leituras por zona (períodos do dia, **sem rótulo de período** no
payload) com a coordenada da antena agregadora — o **front agrega por zona** (1 pin/valor por zona).

### Query params (opcionais)
`?regiao=Campeche` — filtra pela zona (origem do cluster).

### Response 200
```json
{
  "tipo": "mapa",
  "dados": [
    { "regiao": "TRINDADE", "lat": -27.5985, "lng": -48.5230, "valor": 18400, "sem_dados": false }
  ]
}
```
- `regiao` = **cluster** Vísent (`UPPER_SNAKE`, ex.: `TRINDADE`, `CBD_BEIRAMAR`) — **não** é bairro.
- `valor` = **concentração** (média de usuários da zona, inteiro). Pode ser `null`.
- `sem_dados` = `true` quando não há leitura válida (no `/mapa` fica `false`; ver `/mapa/rede`).

---

## `GET /api/v1/mapa/rede`

Cobertura/qualidade de **rede** por zona. **Mesmo schema `Visualizacao`** do `/mapa`, mas o `valor`
muda de significado: aqui é o **congestionamento** (taxa 0–1, média ponderada por usuários).

### Query params (opcionais)
`?regiao=Campeche` — filtra pela zona.

### Response 200
```json
{
  "tipo": "mapa",
  "dados": [
    { "regiao": "TRINDADE", "lat": -27.5985, "lng": -48.5230, "valor": 0.35, "sem_dados": false }
  ]
}
```
- `valor` = **congestionamento** (0–1) — o front exibe como **percentual** ("35%"). ⚠️ No dataset atual
  é **quase uniforme** (~0,35 em todas as zonas); o `drop_pct` também. A métrica que varia entre zonas é
  a **concentração** (`/mapa`), não a rede.
- `sem_dados` = `true` quando congestionamento **ou** drop está ausente → **pin vermelho** ("Sem cobertura")
  no front; senão pin azul ("Em monitoramento").

---

## `GET /api/v1/mapa/mobilidade`

Fluxos origem→destino (OD por cluster) para desenhar linhas/setas sobre o mapa.

### Query params (opcionais)
`?regiao=Campeche` — sem `regiao`, devolve os **80 maiores fluxos** por nº de viagens;
com `regiao`, devolve **todos os fluxos que tocam a zona** (origem OU destino).

### Response 200
```json
{
  "tipo": "fluxos",
  "dados": [
    {
      "origem": "ESTREITO_CAPOEIRAS",
      "destino": "CBD_BEIRAMAR",
      "municipio_origem": "Florianópolis",   // pode ser null (ausentes reais no OD)
      "municipio_destino": "Florianópolis",
      "lat_origem": -27.588,
      "lng_origem": -48.585,
      "lat_destino": -27.5954,
      "lng_destino": -48.548,
      "viagens": 28288,
      "usuarios": 24705,
      "dist_km": 3.74,
      "periodo": "NOITE",                    // período predominante do fluxo
      "mesmo_cluster": false                 // true = fluxo interno (não vira linha)
    }
  ]
}
```

---

## `GET /api/v1/mapa/overview`

Referencial de bairros × monitoramento: **todos os 56 bairros** de Florianópolis
(GeoJSON OSM, o mesmo do front) — cada um marcado como monitorado (com as zonas
Vísent que o cobrem) ou **vazio**. O front só separa preenchido × vazio pra pintar
o mapa. Zonas do continente (São José/Palhoça/Biguaçu) não têm bairro no
referencial e vêm na lista separada, com centroide pra virar pin.

### Query params
Nenhum (o cruzamento é fixo, cacheado no backend).

### Response 200
```json
{
  "tipo": "overview",
  "total_antenas": 132,
  "dados": [
    { "bairro": "Trindade", "monitorado": true,  "zonas": ["TRINDADE"], "antenas": 3 },
    { "bairro": "Daniela",  "monitorado": false, "zonas": [],           "antenas": 0 }
  ],
  "zonas_fora_referencial": [
    { "zona": "SAO_JOSE_KOBRASOL", "municipio": "Sao Jose", "lat": -27.5942, "lng": -48.6266, "antenas": 9 }
  ]
}
```

- `zonas` = zonas que cobrem o bairro (match por nome normalizado **ou** antena
  dentro do polígono — bairro com antena dentro nunca fica "não monitorado").
- `antenas` = antenas fisicamente dentro do polígono do bairro.

---

## Convenções gerais

- **Formato:** JSON, UTF-8. Campos em `snake_case` no backend.
- **CORS:** o backend libera a origem do frontend (Vite em `http://localhost:5173`).
- **Versionamento:** mudanças no contrato → avisar o time e atualizar este arquivo.
- **Tipos espelhados:** Pydantic (backend, `app/schemas/dados.py`) e TypeScript (frontend,
  `src/types/index.ts` + mapeamento PT→EN em `src/api/endpoints.ts`) devem refletir os schemas acima.
- **Camadas do mapa no front (lazy por filtro):** `/mapa/overview` (tema inicial) · `/mapa/rede` · `/mapa/mobilidade`
  — cada filtro só chama sua rota quando ativo. Detalhes de renderização em `skills/frontend.md § Mapa temático`.
