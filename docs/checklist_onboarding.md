# Checklist de Onboarding - Dashboard de Atendimento

## ✅ Pré-requisitos do Sistema

### Ferramentas Necessárias
- [ ] Node.js v18+ instalado
- [ ] npm ou yarn instalado  
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)
- [ ] Terminal/CMD configurado

### Verificação do Ambiente
```bash
node --version    # Deve ser 18+
npm --version     # Verificar se está instalado
git --version     # Verificar se está instalado
```

## ✅ Bibliotecas e Dependências

### Backend (Node.js)
- [ ] `express` - Framework web
- [ ] `sqlite3` - Banco de dados
- [ ] `bcryptjs` - Hash de senhas
- [ ] `jsonwebtoken` - Autenticação JWT
- [ ] `express-session` - Gerenciamento de sessões
- [ ] `cors` - Cross-origin requests
- [ ] `helmet` - Segurança
- [ ] `dotenv` - Variáveis de ambiente
- [ ] `joi` - Validação de dados
- [ ] `winston` - Sistema de logs

### Frontend (Next.js + React)
- [ ] `next` - Framework React
- [ ] `react` & `react-dom` - Biblioteca React
- [ ] `tailwindcss` - CSS framework
- [ ] `@tailwindcss/forms` - Estilos para formulários
- [ ] `lucide-react` - Ícones
- [ ] `recharts` - Gráficos
- [ ] `date-fns` - Manipulação de datas
- [ ] `js-cookie` - Gerenciamento de cookies
- [ ] `axios` - Cliente HTTP

### ShadCN/UI Components
- [ ] `@radix-ui/react-dropdown-menu`
- [ ] `@radix-ui/react-select`
- [ ] `@radix-ui/react-dialog`
- [ ] `@radix-ui/react-button`
- [ ] `@radix-ui/react-card`
- [ ] `@radix-ui/react-table`
- [ ] `class-variance-authority`
- [ ] `clsx`
- [ ] `tailwind-merge`

## ✅ Comandos de Instalação

### 1. Configuração Inicial
```bash
# Criar estrutura de pastas
mkdir -p docs agents backend/{utils,services} frontend/{pages,components,public} database/{migrations} tests

# Navegar para backend
cd backend
npm init -y

# Instalar dependências do backend
npm install express sqlite3 bcryptjs jsonwebtoken express-session cors helmet dotenv joi winston
npm install -D nodemon
```

### 2. Configuração do Frontend
```bash
# Navegar para frontend
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Instalar dependências adicionais
npm install lucide-react recharts date-fns js-cookie axios
npm install -D @types/js-cookie

# Configurar ShadCN/UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dropdown-menu select dialog table
```

## ✅ Variáveis de Ambiente

### Arquivo `.env` (Backend)
```bash
# Banco de dados
DATABASE_PATH=./database/dashboard.db

# Autenticação
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
SESSION_SECRET=seu_session_secret_super_seguro_aqui

# Servidor
PORT=3001
NODE_ENV=development

# Logs
LOG_LEVEL=info
LOG_DIR=./logs
```

### Arquivo `.env.local` (Frontend)
```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# App
NEXT_PUBLIC_APP_NAME=Dashboard de Atendimento
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## ✅ Scripts Package.json

### Backend (`backend/package.json`)
```json
{
  "scripts": {
    "dev": "nodemon api.js",
    "start": "node api.js",
    "setup-db": "node scripts/setup-database.js",
    "add-client": "node scripts/add-client.js",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Frontend (`frontend/package.json`)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## ✅ Configurações Obrigatórias

### TailwindCSS (`frontend/tailwind.config.js`)
- [ ] Configurar cores personalizadas
- [ ] Adicionar suporte a dark mode
- [ ] Configurar fontes customizadas

### Next.js (`frontend/next.config.js`)
- [ ] Configurar proxy para API
- [ ] Otimizações de produção
- [ ] Configurações de imagem

### TypeScript (`frontend/tsconfig.json`)
- [ ] Configurar paths absolutos
- [ ] Configurar tipos globais

## ✅ Estrutura de Arquivos Críticos

### Banco de Dados
- [ ] `database/schemas.sql` - Schema das tabelas
- [ ] `database/migrations/001_initial.sql` - Migration inicial
- [ ] `backend/db.js` - Configuração do SQLite

### Autenticação
- [ ] `backend/middleware/auth.js` - Middleware de autenticação
- [ ] `backend/services/authService.js` - Lógica de autenticação
- [ ] `frontend/lib/auth.js` - Cliente de autenticação

### Componentes Base
- [ ] `frontend/components/ui/` - Componentes ShadCN
- [ ] `frontend/components/Dashboard.jsx` - Dashboard principal
- [ ] `frontend/components/Login.jsx` - Tela de login
- [ ] `frontend/lib/utils.js` - Funções utilitárias

## ✅ Validação Final

### Testes de Funcionamento
- [ ] Backend inicia sem erros
- [ ] Frontend inicia sem erros
- [ ] Banco de dados é criado corretamente
- [ ] Login funciona
- [ ] Dashboard carrega métricas
- [ ] Tema escuro/claro funciona
- [ ] Responsividade móvel OK

### Comandos de Teste
```bash
# Verificar backend
cd backend && npm run dev

# Verificar frontend (nova aba)
cd frontend && npm run dev

# Acessar aplicação
# http://localhost:3000 (frontend)
# http://localhost:3001 (backend API)
```

## ✅ Próximos Passos Após Setup

1. [ ] Criar usuário admin inicial
2. [ ] Popular banco com dados de exemplo
3. [ ] Configurar logs de desenvolvimento
4. [ ] Testar todas as funcionalidades
5. [ ] Documentar APIs endpoints
6. [ ] Preparar ambiente de produção

## 🚨 Pontos de Atenção

- **Segurança**: Nunca commitar arquivos `.env`
- **Performance**: Configurar cache adequadamente
- **Logs**: Implementar sistema de logs robusto
- **Backup**: Configurar backup automático do SQLite
- **Monitoring**: Implementar health checks 