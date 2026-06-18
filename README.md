# App BiT — B2G | Equipo 17
## Painel de Dados Públicos com IA

> Hackathon App BiT — Wongola / Black in Tech  
> Desafío: B2G — Painel de Dados Públicos  
> Demo Day: 10/07/2026

---

## 🧩 O problema que resolvemos

Gestores públicos não têm acesso fácil a dados cruzados de mobilidade urbana, emprego e saúde mental por região para basear políticas de inclusão social em evidências reais.

Nossa solução é uma Web App Responsiva (PWA) com agente de IA que responde consultas em linguagem natural usando o dataset Vísent CDRView — dados reais de concentração de pessoas e cobertura de rede por região.

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- Node.js 18+ ou Python 3.10+
- Git

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install        # ou: pip install -r requirements.txt
cp .env.example .env
# preencha as variáveis no .env
npm start          # ou: uvicorn app.main:app --reload
```

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```
# Backend
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/appbit_b2g
LLM_API_KEY=sua_chave_aqui

# Frontend
VITE_API_URL=http://localhost:3000
```

---

## 📡 Endpoints principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/dados` | Consulta ao agente de IA em linguagem natural |
| GET | `/mapa` | Dados de concentração por região (Vísent CDRView) |
| GET | `/health` | Status da API |

### Exemplo de uso

```bash
POST /dados
{
  "consulta": "Onde faltam programas de formação para jovens de baixa renda?",
  "filtros": { "regiao": "Sudeste", "indicador": "emprego" }
}
```

---

## 📊 Dataset Vísent CDRView

Dados de concentração de pessoas por zona + cobertura de rede ERB (5G/4G/3G) com coordenadas reais de antenas Anatel.

Disponível em: [github.com/wongola-bit/appbit-hackathon](https://github.com/wongola-bit/appbit-hackathon)

Consulte o `dataset/README.md` para o dicionário de colunas completo.

---

## 🏗️ Arquitetura

```
[PWA Frontend] → [API REST] → [Agente IA] → [Dataset Vísent]
                     ↓
               [Banco de dados]
```

Veja detalhes em `docs/arquitetura.md`

---

## 👥 Equipe

| Nome | Perfil | GitHub |
|------|--------|--------|
| [Nome] | [Perfil] | [@usuario] |
| [Nome] | [Perfil] | [@usuario] |
| [Nome] | [Perfil] | [@usuario] |
| [Nome] | [Perfil] | [@usuario] |
| [Nome] | [Perfil] | [@usuario] |
| [Nome] | [Perfil] | [@usuario] |

---

## 📋 Progresso

- [ ] Semana 1 — Setup do projeto e contrato de integração
- [ ] Semana 2 — Primeiros endpoints e telas funcionando
- [ ] Semana 3 — Deploy inicial + pipeline do dataset Vísent
- [ ] Semana 4 — MVP completo
- [ ] Semana 5 — Pitch e Demo Day

---

## 🔗 Links úteis

- Discord do hackathon: [discord.gg/7gBYpXCh3j](https://discord.gg/7gBYpXCh3j)
- Brief completo: [github.com/wongola-bit/appbit-hackathon](https://github.com/wongola-bit/appbit-hackathon)
- Dataset Vísent: [github.com/wongola-bit/appbit-hackathon](https://github.com/wongola-bit/appbit-hackathon)
