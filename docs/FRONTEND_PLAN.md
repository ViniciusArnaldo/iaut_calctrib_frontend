# 📋 Plano de Implementação do Frontend - iaut_calctrib_frontend

## 🎯 Visão Geral

Sistema frontend em React para consumir a API de cálculo de tributos da reforma tributária brasileira (CBS/IBS/IS).

---

## 📊 Análise do Backend (API Disponível)

### Endpoints Mapeados (50 endpoints)

#### 1. **Auth Module** (3 endpoints)
```
POST   /api/v1/auth/login          - Login de usuário
POST   /api/v1/auth/register       - Registro de empresa + primeiro usuário
POST   /api/v1/auth/refresh        - Renovar access token
```

**Dados de resposta:**
- `user` (id, name, email, role, tenant)
- `accessToken`
- `refreshToken`

#### 2. **Calculadora Module** (22 endpoints)

**Cálculos:**
```
POST   /api/v1/calculadora/regime-geral                           - Cálculo principal (CBS, IBS, IS)
POST   /api/v1/calculadora/pedagio                                - Cálculo de pedágio
POST   /api/v1/calculadora/base-calculo/is-mercadorias            - Base IS
POST   /api/v1/calculadora/base-calculo/cbs-ibs-mercadorias       - Base CBS/IBS
```

**Histórico e Stats:**
```
GET    /api/v1/calculadora/historico                              - Lista de cálculos (paginado, filtros)
GET    /api/v1/calculadora/historico/:id                          - Detalhes de um cálculo
GET    /api/v1/calculadora/estatisticas                           - Dashboard (uso, limites, etc)
```

**Dados Abertos (para popular dropdowns):**
```
GET    /api/v1/calculadora/dados-abertos/versao
GET    /api/v1/calculadora/dados-abertos/ufs
GET    /api/v1/calculadora/dados-abertos/municipios?siglaUf=RS
GET    /api/v1/calculadora/dados-abertos/ncm?ncm=24021000&data=2027-01-01
GET    /api/v1/calculadora/dados-abertos/nbs?nbs=114052200&data=2027-01-01
GET    /api/v1/calculadora/dados-abertos/situacoes-tributarias/cbs-ibs?data=2026-01-01
GET    /api/v1/calculadora/dados-abertos/situacoes-tributarias/imposto-seletivo?data=2027-01-01
GET    /api/v1/calculadora/dados-abertos/aliquota-uniao?data=2026-01-01
GET    /api/v1/calculadora/dados-abertos/aliquota-uf?codigoUf=43&data=2026-01-01
GET    /api/v1/calculadora/dados-abertos/aliquota-municipio?codigoMunicipio=4314902&data=2026-01-01
GET    /api/v1/calculadora/dados-abertos/classificacoes-tributarias/cbs-ibs?data=2026-01-01
GET    /api/v1/calculadora/dados-abertos/classificacoes-tributarias/imposto-seletivo?data=2026-01-01
POST   /api/v1/calculadora/cache/limpar
```

#### 3. **Users Module** (6 endpoints)
```
POST   /api/v1/users              - Criar novo usuário no tenant
GET    /api/v1/users              - Listar usuários do tenant
GET    /api/v1/users/:id          - Detalhes de um usuário
PATCH  /api/v1/users/:id          - Atualizar usuário
DELETE /api/v1/users/:id          - Deletar usuário
POST   /api/v1/users/:id/activate - Ativar/desativar usuário
```

#### 4. **Subscriptions Module** (6 endpoints)
```
GET    /api/v1/subscriptions         - Assinatura atual do tenant
GET    /api/v1/subscriptions/history - Histórico de assinaturas
GET    /api/v1/subscriptions/plans   - Planos disponíveis
GET    /api/v1/subscriptions/usage   - Estatísticas de uso detalhadas
PATCH  /api/v1/subscriptions/upgrade - Fazer upgrade/downgrade
POST   /api/v1/subscriptions/cancel  - Cancelar assinatura
```

**Planos:**
- BASIC: 50 cálculos/mês - R$ 99,90
- PROFESSIONAL: 200 cálculos/mês - R$ 299,90
- ENTERPRISE: Ilimitado - R$ 999,90

#### 5. **Super Admin Module** (8 endpoints - apenas super admin)
```
GET    /api/v1/super-admin/statistics           - Stats globais
GET    /api/v1/super-admin/tenants              - Listar todos tenants
GET    /api/v1/super-admin/tenants/:id          - Detalhes tenant
POST   /api/v1/super-admin/tenants              - Criar tenant
PATCH  /api/v1/super-admin/tenants/:id          - Atualizar tenant
POST   /api/v1/super-admin/tenants/:id/deactivate
POST   /api/v1/super-admin/tenants/:id/reactivate
PATCH  /api/v1/super-admin/tenants/:id/plan     - Alterar plano
```

#### 6. **Two-Factor Module** (5 endpoints)
```
POST   /api/v1/two-factor/setup    - Gerar QR Code para 2FA
POST   /api/v1/two-factor/enable   - Habilitar 2FA
POST   /api/v1/two-factor/disable  - Desabilitar 2FA
POST   /api/v1/two-factor/verify   - Verificar código 2FA
GET    /api/v1/two-factor/status   - Status do 2FA
```

---

## 🏗️ Arquitetura do Frontend

### Stack Técnica
```json
{
  "library": "React 19",
  "language": "TypeScript 5.8+",
  "bundler": "Vite 7.x",
  "routing": "React Router 7.x",
  "styling": "TailwindCSS 3.4+",
  "forms": "react-hook-form + zod",
  "state": "@tanstack/react-query",
  "http": "axios",
  "ui": "shadcn/ui (opcional) ou Headless UI",
  "charts": "recharts ou chart.js"
}
```

### Estrutura de Pastas Sugerida
```
iaut_calctrib_frontend/
├── public/
├── src/
│   ├── api/                      # Clientes API e configuração axios
│   │   ├── axios-instance.ts
│   │   ├── auth.api.ts
│   │   ├── calculadora.api.ts
│   │   ├── users.api.ts
│   │   ├── subscriptions.api.ts
│   │   └── super-admin.api.ts
│   │
│   ├── components/               # Componentes reutilizáveis
│   │   ├── ui/                   # Componentes base (Button, Input, etc)
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── forms/                # Form components
│   │   │   ├── CalculadoraForm.tsx
│   │   │   └── UserForm.tsx
│   │   └── common/               # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── features/                 # Features organizadas por módulo
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── calculadora/
│   │   │   ├── components/
│   │   │   │   ├── RegimeGeralForm.tsx
│   │   │   │   ├── PedagioForm.tsx
│   │   │   │   ├── ResultadoCard.tsx
│   │   │   │   └── HistoricoTable.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCalcular.ts
│   │   │   │   ├── useHistorico.ts
│   │   │   │   └── useDadosAbertos.ts
│   │   │   └── types/
│   │   │       └── calculadora.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── UsageChart.tsx
│   │   │   │   └── RecentCalculations.tsx
│   │   │   └── hooks/
│   │   │       └── useStats.ts
│   │   │
│   │   ├── subscriptions/
│   │   │   ├── components/
│   │   │   │   ├── PlanCard.tsx
│   │   │   │   └── UpgradeModal.tsx
│   │   │   └── hooks/
│   │   │       └── useSubscription.ts
│   │   │
│   │   └── users/
│   │       ├── components/
│   │       │   └── UsersTable.tsx
│   │       └── hooks/
│   │           └── useUsers.ts
│   │
│   ├── hooks/                    # Global hooks
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   │
│   ├── layouts/                  # Layout wrappers
│   │   ├── AuthLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── PublicLayout.tsx
│   │
│   ├── pages/                    # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── calculadora/
│   │   │   ├── CalculadoraPage.tsx
│   │   │   └── HistoricoPage.tsx
│   │   ├── subscriptions/
│   │   │   └── SubscriptionsPage.tsx
│   │   ├── users/
│   │   │   └── UsersPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/                   # Routing configuration
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/                 # Business logic services
│   │   ├── auth.service.ts
│   │   ├── storage.service.ts   # localStorage/sessionStorage
│   │   └── token.service.ts     # JWT handling
│   │
│   ├── store/                    # Global state (se necessário)
│   │   └── auth-store.ts        # Zustand ou Context
│   │
│   ├── types/                    # TypeScript types globais
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 📝 Plano de Implementação (Ordem Recomendada)

### **Fase 1: Setup Inicial** (1-2h)
1. ✅ Criar projeto Vite + React + TypeScript
2. ✅ Instalar dependências principais
3. ✅ Configurar TailwindCSS
4. ✅ Configurar ESLint/Prettier
5. ✅ Criar estrutura de pastas
6. ✅ Configurar variáveis de ambiente (.env)

### **Fase 2: Configuração Base** (2-3h)
1. ✅ Configurar axios instance com interceptors
2. ✅ Criar serviços de token e storage
3. ✅ Configurar React Query
4. ✅ Criar tipos TypeScript base
5. ✅ Configurar React Router
6. ✅ Criar componentes UI básicos (Button, Input, Card)

### **Fase 3: Autenticação** (3-4h)
1. ✅ Implementar API de auth
2. ✅ Criar AuthContext/Provider
3. ✅ Implementar LoginPage
4. ✅ Implementar RegisterPage
5. ✅ Criar ProtectedRoute
6. ✅ Implementar logout e refresh token
7. ✅ Adicionar interceptor para renovação automática

### **Fase 4: Layout e Dashboard** (2-3h)
1. ✅ Criar DashboardLayout (Navbar + Sidebar)
2. ✅ Implementar Dashboard principal
3. ✅ Criar componentes de estatísticas
4. ✅ Integrar endpoint de estatísticas
5. ✅ Adicionar indicador de limite de uso

### **Fase 5: Módulo Calculadora** (4-5h)
1. ✅ Criar API client para calculadora
2. ✅ Implementar form de Regime Geral (principal)
3. ✅ Criar campos dinâmicos para itens
4. ✅ Integrar dados abertos (UFs, municípios, NCM)
5. ✅ Implementar validação com Zod
6. ✅ Criar componente de resultado
7. ✅ Adicionar loading e error states

### **Fase 6: Histórico** (2h)
1. ✅ Criar tabela de histórico com paginação
2. ✅ Implementar filtros (data, tipo)
3. ✅ Criar modal de detalhes do cálculo
4. ✅ Adicionar exportação (futuro: PDF/Excel)

### **Fase 7: Assinaturas** (2h)
1. ✅ Criar página de planos
2. ✅ Implementar upgrade/downgrade
3. ✅ Mostrar estatísticas de uso
4. ✅ Criar histórico de assinaturas
5. ✅ Adicionar alertas de limite próximo

### **Fase 8: Gestão de Usuários** (2h)
1. ✅ Criar tabela de usuários (apenas ADMIN)
2. ✅ Implementar CRUD de usuários
3. ✅ Criar form de criação/edição
4. ✅ Adicionar controle de permissões

### **Fase 9: Polimento** (2-3h)
1. ✅ Adicionar toasts/notificações
2. ✅ Melhorar UX (loading, skeleton, empty states)
3. ✅ Adicionar validações client-side
4. ✅ Testes básicos
5. ✅ Ajustes de responsividade
6. ✅ Documentação

---

## 🎨 UI/UX Considerations

### Cores Sugeridas (tema tributos/governo)
```css
primary: #1e40af (azul governo)
secondary: #059669 (verde aprovado)
danger: #dc2626 (vermelho)
warning: #f59e0b (amarelo)
```

### Páginas Principais
1. **Login/Register** - Simples, clean
2. **Dashboard** - Cards com stats, gráfico de uso, recent calculations
3. **Calculadora** - Form wizard multi-step ou form único com abas
4. **Histórico** - Tabela com busca e filtros
5. **Planos** - Cards de pricing com destaque no atual
6. **Usuários** - Tabela CRUD (apenas ADMIN)

---

## 🔐 Segurança no Frontend

1. **Token Storage**: localStorage para refresh token, memory para access token
2. **Auto-refresh**: Interceptor axios para renovar token expirado
3. **Protected Routes**: HOC para verificar autenticação
4. **Role-based**: Esconder features por role (ADMIN vs USER)
5. **Sanitização**: DOMPurify para inputs (se necessário)

---

## 📦 Dependências Sugeridas

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.8.0",
    "vite": "^7.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 🚀 Próximos Passos

### Começar por:
1. **Setup do projeto** (Fase 1)
2. **Autenticação** (Fase 3) - Mais crítico
3. **Dashboard básico** (Fase 4)
4. **Form de cálculo simples** (Fase 5)
5. **Iteração e melhoria**

### Comando para iniciar:
```bash
cd C:\GitHub
npm create vite@latest iaut_calctrib_frontend -- --template react-ts
cd iaut_calctrib_frontend
npm install
```

---

## 💡 Recomendações

1. **Começar simples**: Fazer auth + dashboard + 1 form de cálculo funcionando primeiro
2. **Componentização**: Criar componentes reutilizáveis desde o início
3. **TypeScript strict**: Usar tipos fortes para evitar bugs
4. **React Query**: Aproveitar cache automático e refetch
5. **Error handling**: Criar boundary de erro global
6. **Loading states**: UX suave com skeletons
7. **Mobile-first**: Garantir responsividade

---

**Posso começar criando o projeto agora?** Ou prefere que eu detalhe alguma parte específica antes?
