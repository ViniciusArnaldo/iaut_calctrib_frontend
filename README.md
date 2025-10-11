# 🧮 iaut_calctrib_frontend

Frontend da aplicação de cálculo de tributos conforme a Reforma Tributária Brasileira (CBS, IBS, Imposto Seletivo).

## 📋 Sobre o Projeto

Sistema web desenvolvido em React para permitir o cálculo automatizado de tributos da reforma tributária brasileira, incluindo:
- **CBS** (Contribuição sobre Bens e Serviços)
- **IBS** (Imposto sobre Bens e Serviços)
- **IS** (Imposto Seletivo)

## 🚀 Stack Tecnológica

- **React 19** - Biblioteca UI
- **TypeScript 5.8+** - Type safety
- **Vite 7.x** - Build tool e dev server
- **React Router 7.x** - Roteamento
- **TailwindCSS 3.4+** - Estilização
- **React Hook Form + Zod** - Formulários e validação
- **@tanstack/react-query** - Gerenciamento de estado servidor
- **Axios** - Cliente HTTP

## ✨ Funcionalidades

### Autenticação
- ✅ Login e registro multi-tenant
- ✅ Refresh token automático
- ✅ Proteção de rotas

### Dashboard
- ✅ Estatísticas de uso em tempo real
- ✅ Indicadores de limite de plano
- ✅ Navegação intuitiva

### Calculadora
- ✅ Formulário dinâmico com múltiplos itens
- ✅ Dropdowns cascateados (UF → Município)
- ✅ Validação robusta com Zod
- ✅ Exibição detalhada de resultados
- ✅ Cálculo de CBS, IBS e IS por item

### Histórico
- ✅ Tabela com paginação
- ✅ Filtros por data e tipo
- ✅ Visualização de cálculos anteriores

### Assinaturas
- ✅ Visualização de planos disponíveis
- ✅ Upgrade/downgrade de plano
- ✅ Indicador de uso do mês
- ✅ Histórico de assinaturas

### Gestão de Usuários (ADMIN)
- ✅ CRUD completo de usuários
- ✅ Controle de permissões (ADMIN/USER)
- ✅ Ativar/desativar usuários
- ✅ Acesso restrito a administradores

### UX
- ✅ Toasts/notificações
- ✅ Loading states e skeletons
- ✅ Modais de confirmação
- ✅ Layout responsivo
- ✅ Navegação com Sidebar

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e npm
- Backend rodando em `http://localhost:3010`

### Passo a Passo

```bash
# Clone o repositório
cd C:\GitHub\iaut_calctrib_frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie o arquivo .env na raiz com:
VITE_API_BASE_URL=http://localhost:3010/api/v1
VITE_API_TIMEOUT=30000
VITE_NODE_ENV=development

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa ESLint
```

## 📁 Estrutura do Projeto

```
src/
├── api/                      # Clientes API
│   ├── axios-instance.ts     # Configuração Axios
│   ├── auth.api.ts          # API de autenticação
│   ├── calculadora.api.ts   # API de cálculos
│   ├── subscriptions.api.ts # API de assinaturas
│   └── users.api.ts         # API de usuários
│
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Card.tsx
│   ├── layout/              # Layout components
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── common/              # Componentes comuns
│       ├── ProtectedRoute.tsx
│       ├── Toast.tsx
│       ├── ConfirmDialog.tsx
│       └── Skeleton.tsx
│
├── features/                # Features por módulo
│   ├── auth/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── types/
│   ├── calculadora/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── dashboard/
│   │   ├── components/
│   │   └── hooks/
│   ├── subscriptions/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── users/
│       ├── hooks/
│       └── types/
│
├── hooks/                   # Global hooks
│   └── useToast.ts
│
├── layouts/                 # Layout wrappers
│   └── DashboardLayout.tsx
│
├── pages/                   # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── calculadora/
│   ├── historico/
│   ├── subscriptions/
│   └── users/
│
├── services/                # Services
│   └── storage.service.ts
│
├── types/                   # Types globais
│
├── utils/                   # Utilities
│   └── constants.ts
│
├── App.tsx                  # App principal
└── main.tsx                 # Entry point
```

## 🔐 Segurança

- **Access Token**: Armazenado em memória (não persiste)
- **Refresh Token**: Armazenado em localStorage
- **Auto-refresh**: Interceptor Axios renova tokens automaticamente
- **Protected Routes**: HOC verifica autenticação
- **Role-based Access**: Features restritas por role (ADMIN vs USER)

## 🎨 Temas e Cores

```css
Primary: #3b82f6 (Azul)
Success: #10b981 (Verde)
Danger: #ef4444 (Vermelho)
Warning: #f59e0b (Amarelo)
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🧪 Integração com Backend

O frontend consome os seguintes endpoints:

### Autenticação
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`

### Calculadora
- `POST /calculadora/regime-geral`
- `GET /calculadora/dados-abertos/ufs`
- `GET /calculadora/dados-abertos/municipios`
- `GET /calculadora/historico`
- `GET /calculadora/estatisticas`

### Assinaturas
- `GET /subscriptions`
- `GET /subscriptions/plans`
- `GET /subscriptions/usage`
- `PATCH /subscriptions/upgrade`

### Usuários (ADMIN)
- `GET /users`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `POST /users/:id/activate`

## 🚦 Como Testar

1. **Inicie o backend**:
```bash
cd C:\GitHub\iaut_calctrib_backend
npm run start:dev
```

2. **Inicie o frontend**:
```bash
cd C:\GitHub\iaut_calctrib_frontend
npm run dev
```

3. **Acesse**: `http://localhost:5173`

4. **Registre uma empresa** (primeira vez):
   - Nome da empresa
   - Seu nome
   - Email
   - Senha

5. **Explore as funcionalidades**:
   - Dashboard com estatísticas
   - Calculadora de tributos
   - Histórico de cálculos
   - Assinaturas e planos
   - Gestão de usuários (se ADMIN)

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se que o backend está configurado para aceitar requisições de `http://localhost:5173`

### Token expirado
O sistema renova automaticamente. Se persistir, faça logout e login novamente.

### Erro 404 nas rotas
Certifique-se que o backend está rodando em `http://localhost:3010`

## 👥 Autores

Desenvolvido por **Claude Code** seguindo as especificações do FRONTEND_PLAN.md

## 📄 Licença

Este projeto é privado e confidencial.

---

**Status**: ✅ Produção Ready
**Versão**: 1.0.0
**Última atualização**: 2025-01-10
