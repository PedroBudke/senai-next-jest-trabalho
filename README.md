# AuthTask Manager

Trabalho 01 — Testes unitários com Jest + React Testing Library

**Dupla:** Pedro Henrique Budke & Manoela Pinto Guedes
**Repositório:** https://github.com/PedroBudke/senai-next-jest-trabalho

---

## Como começar

1. **Clone o repositório**
2. **Instale as dependências:** `npm install`
3. **Configure o ambiente:** copie `.env.example` para `.env.local` e preencha as variáveis do Firebase
4. **Rode a aplicação:** `npm run dev`
5. **Acesse:** http://localhost:3000 — login: `aluno@authtask.dev` / senha: `123456`

---

## Como rodar os testes

```bash
npm run test           # Executa todos os testes
npm run test:watch     # Modo watch (re-executa ao salvar)
npm run test:coverage  # Com relatório de cobertura
```

---

## Arquitetura

A aplicação segue uma estrutura pensada para **testabilidade** e **separação de responsabilidades**.

```
src/
├── app/                    # Rotas e páginas (App Router)
│   ├── login/              # Página de login
│   ├── dashboard/          # Dashboard protegido
│   ├── api/                # API Routes
│   │   ├── login/          # POST /api/login
│   │   ├── logout/         # POST /api/logout
│   │   └── tasks/          # CRUD de tarefas
│   └── page.tsx            # Landing
├── components/             # Componentes React
│   ├── auth/               # LoginForm
│   ├── dashboard/          # DashboardClient, TaskList, TaskComposer, ServerTaskSummary
│   └── providers/          # AppProviders (AuthProvider)
├── context/                # AuthContext + useAuth
├── services/               # Lógica de negócio
│   ├── auth/               # Validação, autenticação, sessão
│   └── tasks/              # Serviço de tarefas + repositório Firestore
├── utils/                  # AppError, http-response
└── __tests__/              # Testes implementados
```

### Separação de responsabilidades

| Camada | Responsabilidade | Testabilidade |
|--------|------------------|---------------|
| **Components** | UI, interação do usuário | Testes com RTL, mocks de context/hooks |
| **Context** | Estado global de autenticação | Testes isolados do Provider e do hook |
| **Services** | Regras de negócio, validação | Testes unitários puros, sem UI |
| **API Routes** | HTTP, orquestração | Testes chamando a função POST/GET diretamente |
| **Utils** | Erros, respostas HTTP | Testes unitários simples |

---

## Decisões técnicas

### Autenticação
- **Demo user:** credenciais fixas via variáveis de ambiente (adequado para ambiente didático)
- **Sessão:** cookie HTTP-only com token HMAC-SHA256, TTL de 8 horas
- **Middleware:** protege `/dashboard` e redireciona usuário não autenticado para `/login`

### Persistência
- **Firestore REST API:** tarefas em `users/{userId}/tasks`
- **Variáveis:** `FIREBASE_PROJECT_ID`, `FIREBASE_WEB_API_KEY`

### Serviço de tarefas
- **Injeção de dependência:** `buildTaskService({ repository })` permite mockar o repositório nos testes sem acesso real ao Firestore
- **Validação centralizada:** `validateTaskTitle`, `assertIdentifier` no serviço

### Server Component
- **ServerTaskSummary:** busca resumo no servidor via `taskService.getSummary`
- Testado com `await ServerTaskSummary({ userId })` para resolver a Promise do async component

---

## Estratégia de testes

O trabalho foi dividido em 12 etapas seguindo o Guia Evolutivo, com foco em TDD, cobertura e CI/CD.

### Etapas implementadas

| Etapa | Responsável | Descrição |
|-------|-------------|-----------|
| 0 | Pedro | Configuração do Jest + React Testing Library |
| 1 | Pedro | TDD: validação de login (`validateLoginPayload`, `hasValidationErrors`) |
| 2 | Pedro | TDD: serviço de autenticação (`authenticateUser`, `sanitizeUserId`) |
| 3 | Pedro | TDD: manipulação de tarefas (`validateTaskTitle`, `buildTaskService`) |
| 4 | Pedro | Testes unitários completos (`AppError`, `isAppError`, `toErrorResponse`, `getSummary`) |
| 5 | Manoela | Testes de componentes (`LoginForm`, `DashboardClient`, `TaskComposer`, `TaskList`) |
| 6 | Manoela | Mock avançado (`jest.spyOn`, mock condicional, timeout) |
| 7 | Manoela | Teste de Context API (`AuthProvider`, `useAuth`) |
| 8 | Manoela | Teste de Server Component (`ServerTaskSummary`) |
| 9 | Manoela | Teste de API Route (`POST /api/login`) |
| 10 | Pedro | Cobertura obrigatória com `coverageThreshold` |
| 11 | Pedro | CI/CD com GitHub Actions |
| 12 | Pedro | Desafios bônus (fake timers, snapshot, múltiplos usuários, MSW) |

### Evidências de TDD (ciclo Red → Green → Refactor)

Cada funcionalidade abaixo seguiu o fluxo TDD com 3 commits:

**1. Validação de login (Etapa 1)**
- `test: create failing test for login validation` — testes escritos com expect proposital errado
- `feat: implement login validation` — implementação mínima para passar
- `refactor: improve validation logic` — refatoração

**2. Manipulação de tarefas (Etapa 3)**
- `test: create failing test for task title rules` — Red
- `feat: implement create task rules` — Green
- `refactor: extract validation helper` — Refactor

**3. Testes de componentes (Etapa 5)**
- `test: create failing tests for React components` — Red
- `feat: implement component tests with RTL` — Green
- `refactor: improve component test queries` — Refactor

### Cobertura atingida

```
Statements : 95.1% (meta: 85%) ✅
Branches   : 80.1% (meta: 80%) ✅
Functions  : 92.1% (meta: 85%) ✅
Lines      : 95.1% (meta: 85%) ✅
```

### Arquivos de teste

| Arquivo | O que testa |
|---------|-------------|
| `auth.service.validation.test.ts` | `validateLoginPayload`, `hasValidationErrors` |
| `auth.service.auth.test.ts` | `authenticateUser`, `sanitizeUserId` |
| `task.service.test.ts` | `validateTaskTitle`, `buildTaskService` |
| `utils.test.ts` | `AppError`, `isAppError`, `toErrorResponse`, `badRequest` |
| `LoginForm.test.tsx` | Renderização, submit, feedback de erro |
| `DashboardClient.test.tsx` | Cabeçalho, logout, loading, erro, CRUD |
| `TaskComposer.test.tsx` | Input, botão Adicionar, erro de validação |
| `TaskList.test.tsx` | Lista vazia, itens, checkbox, Deletar |
| `advanced.mocks.test.ts` | `jest.spyOn`, mock condicional, timeout |
| `AuthContext.test.tsx` | `AuthProvider`, `useAuth`, login, logout |
| `ServerTaskSummary.test.tsx` | Async Server Component com mock |
| `route.login.test.ts` | `POST /api/login` — 200, 400, 401 |
| `bonus.session.test.ts` | Fake timers — expiração de token |
| `bonus.snapshot.test.tsx` | Snapshot tests de componentes estáveis |
| `bonus.multiuser.test.ts` | Múltiplos usuários com listas distintas |
| `bonus.msw.test.tsx` | Mock Service Worker |

---

## CI/CD

O pipeline GitHub Actions está configurado em `.github/workflows/ci.yml` e roda automaticamente em todo push e pull request para `main`.

**Etapas do pipeline:**
1. Checkout do código
2. Setup Node.js 22
3. Instalação de dependências (`npm ci`)
4. Execução dos testes com cobertura (`npm run test:coverage`)
5. Upload do relatório de cobertura como artefato

O build **falha automaticamente** se qualquer threshold de cobertura não for atingido.

---

## Variáveis de ambiente

Consulte `.env.example`. Principais:

| Variável | Uso |
|----------|-----|
| `AUTH_SESSION_SECRET` | Assinatura do token de sessão HMAC-SHA256 |
| `AUTH_DEMO_EMAIL` | E-mail do usuário demo |
| `AUTH_DEMO_PASSWORD` | Senha do usuário demo |
| `AUTH_DEMO_USER_ID` | ID do usuário demo |
| `AUTH_DEMO_USER_NAME` | Nome do usuário demo |
| `FIREBASE_PROJECT_ID` | ID do projeto Firestore |
| `FIREBASE_WEB_API_KEY` | Chave da API do Firebase |

---

## Checklist de entrega

- [x] Link do repositório GitHub: https://github.com/PedroBudke/senai-next-jest-trabalho
- [x] README com arquitetura, decisões e estratégia de testes
- [x] Histórico de commits demonstrando TDD (3 funcionalidades)
- [x] Cobertura mínima: 95% statements, 80% branches, 92% functions, 95% lines
- [x] Pipeline CI funcionando (GitHub Actions)
- [x] Desafios bônus implementados (fake timers, snapshot, múltiplos usuários, MSW)

---

## Licença

Uso didático — SENAI/SC