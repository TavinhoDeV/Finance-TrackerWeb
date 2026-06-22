# 💻 Finance Tracker Web

Frontend do [Finance Tracker API](https://github.com/TavinhoDev/finance-tracker-api) — dashboard de finanças pessoais construído com **Next.js 14**, **TypeScript** e **Tailwind CSS**.

> Parte do ecossistema Finance Tracker, que também inclui a [REST API](https://github.com/seu-usuario/finance-tracker-api) em ASP.NET Core e o [Worker Service](https://github.com/seu-usuario/finance-tracker-worker) para alertas automáticos.

---

## 📸 Telas

| Tela | Descrição |
|---|---|
| Login / Cadastro | Autenticação com JWT, redirecionamento automático |
| Dashboard | Patrimônio total, contas positivas, resumo de saldo |
| Contas | Criar, visualizar e excluir contas bancárias |
| Transações | Listagem paginada com filtros por tipo, criar e excluir |
| Relatório Mensal | Gráfico de barras (receitas vs despesas) + pizza por categoria |

---

## 🧰 Tech Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 14.2.5 | Framework (App Router) |
| TypeScript | ^5 | Tipagem estática |
| Tailwind CSS | ^3.4 | Estilização |
| Recharts | ^2.12 | Gráficos interativos |
| lucide-react | ^0.414 | Ícones |
| clsx + tailwind-merge | latest | Utilitários de classes |

---

## 🗂️ Estrutura do projeto

```
ft-web/
├── app/                    # Páginas (Next.js App Router)
│   ├── login/              # Tela de login
│   ├── register/           # Tela de cadastro
│   ├── dashboard/          # Dashboard principal
│   ├── accounts/           # Gerenciamento de contas
│   ├── transactions/       # Listagem de transações
│   ├── reports/            # Relatório mensal com gráficos
│   ├── layout.tsx          # Layout raiz
│   └── globals.css         # Estilos globais (Tailwind)
│
├── components/
│   ├── ui/                 # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   └── layout/             # Estrutura do dashboard
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── DashboardLayout.tsx
│
├── services/               # Chamadas à API (fetch nativo)
│   ├── auth.ts             # Login, register, saveSession, logout
│   ├── accounts.ts         # CRUD de contas
│   └── transactions.ts     # CRUD de transações + resumo mensal
│
├── types/                  # Interfaces TypeScript
│   └── index.ts
│
├── lib/
│   └── utils.ts            # formatCurrency, formatDate, cn()
│
├── .env.local              # Variáveis de ambiente (não commitado)
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- [Finance Tracker API](https://github.com/TavinhoDev/finance-tracker-api) rodando em `http://localhost:5285`

### 1. Clone e instale

```bash
git clone https://github.com/TavinhoDev/finance-tracker-web.git
cd finance-tracker-web
npm install
```

### 2. Configure as variáveis de ambiente

Crie o arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:5285
```

### 3. Rode em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 4. Build para produção

```bash
npm run build
npm start
```

---

## 🔌 Integração com a API

Todas as chamadas usam `fetch` nativo com o token JWT armazenado no `localStorage`. O serviço de auth salva e recupera a sessão automaticamente.

```
GET  /api/accounts                              → Lista contas do usuário
POST /api/accounts                              → Cria nova conta
DELETE /api/accounts/{id}                       → Remove conta

GET  /api/accounts/{id}/transactions            → Lista transações (paginado)
POST /api/accounts/{id}/transactions            → Cria transação
DELETE /api/accounts/{id}/transactions/{txId}   → Remove transação
GET  /api/accounts/{id}/transactions/summary/{year}/{month} → Resumo mensal

POST /api/auth/register                         → Cadastro
POST /api/auth/login                            → Login + token JWT
```

---

## ☁️ Deploy (Vercel)

1. Suba o projeto no GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Configure a variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://sua-api-em-producao.com
   ```
4. Clique em **Deploy**

O Vercel detecta Next.js automaticamente — nenhuma configuração adicional necessária.

---

## 🔑 Autenticação

O fluxo de autenticação funciona assim:

1. Usuário faz login → API retorna JWT válido por 8 horas
2. Token é salvo no `localStorage`
3. Todas as requisições incluem o header `Authorization: Bearer <token>`
4. O `DashboardLayout` verifica o token a cada navegação — redireciona para `/login` se ausente

---

## 📦 Tipos principais

```typescript
interface User { userId: string; name: string; email: string; token: string }

interface Account { id: string; name: string; type: number; balance: number; currency: string }

interface Transaction { id: string; description: string; amount: number; type: number; category: number; date: string }

interface MonthlySummary { totalIncome: number; totalExpenses: number; netBalance: number; byCategory: CategorySummary[] }
```

---

## 🤝 Projetos relacionados

- [Finance Tracker API](https://github.com/seu-usuario/finance-tracker-api) — ASP.NET Core 10, Clean Architecture, CQRS, JWT
- [Finance Tracker Worker](https://github.com/seu-usuario/finance-tracker-worker) — Worker Service com alertas de saldo e relatório mensal por e-mail