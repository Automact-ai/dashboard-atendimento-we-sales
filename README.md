# 🚀 Dashboard de Atendimento - Agentes de IA

Dashboard exclusivo para mapear e analisar o desempenho de agentes de IA, oferecendo uma interface multiusuário segura e visualmente atrativa para análise de métricas de atendimento.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## ✨ Características Principais

- 🔐 **Sistema multiusuário** com autenticação JWT segura
- 📊 **Métricas avançadas** de atendimento, vendas e objeções
- 🎨 **Interface moderna** com ShadCN/UI e Tailwind CSS
- 🌓 **Tema claro/escuro** alternável
- 📱 **Totalmente responsivo** para desktop e mobile
- 📈 **Gráficos interativos** com Recharts
- 💾 **Banco SQLite** otimizado com índices e views
- 📤 **Exportação CSV** de relatórios
- 🔒 **Isolamento total** de dados entre clientes (multi-tenant)

## 🛠 Tecnologias Utilizadas

### Backend
- **Node.js** + Express
- **SQLite** com otimizações
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Winston** para logs
- **Joi** para validação

### Frontend
- **Next.js 14** + React
- **Tailwind CSS** para estilização
- **ShadCN/UI** para componentes
- **Recharts** para gráficos
- **Lucide React** para ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## ⚡ Instalação Rápida

```bash
# 1. Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd dashboard-de-atendimento

# 2. Instale dependências do backend
cd backend
npm install

# 3. Configure variáveis de ambiente
cp ../env.example .env
# Edite o arquivo .env com suas configurações

# 4. Configure banco de dados
npm run setup-db

# 5. Popule com dados de exemplo
npm run seed-db

# 6. Inicie o backend
npm run dev

# 7. Em outro terminal, configure o frontend
cd ../frontend
npm install

# 8. Inicie o frontend
npm run dev
```

## 🎯 Acesso Inicial

Após a instalação, acesse: `http://localhost:3000`

### Usuários Padrão:
- **Admin**: `admin@dashboard.com` / `admin123`
- **Demo**: `demo@empresa.com` / `demo123`

⚠️ **Importante**: Altere as senhas padrão após o primeiro login!

## 📊 Métricas Disponíveis

### Dashboard Principal
- Total de atendimentos
- Conversas ativas e concluídas
- Vendas realizadas
- Revenue total
- Taxa de conversão

### Análises Detalhadas
- **Top 10 Produtos** mais vendidos
- **Principais Objeções** e taxa de resolução
- **Motivos de Contato** mais frequentes
- **Vendas ao Longo do Tempo** (gráficos)
- **Conversas ao Longo do Tempo** (gráficos)

### Funcionalidades
- Filtros por período
- Exportação CSV
- Visualizações responsivas
- Atualização em tempo real

## 🏗 Estrutura do Projeto

```
📦 dashboard-de-atendimento/
├── 📁 docs/                    # Documentação
│   ├── briefing.md
│   ├── processos.md
│   └── checklist_onboarding.md
├── 📁 agents/                  # Prompts de IA
├── 📁 backend/                 # API Node.js
│   ├── api.js                 # Servidor principal
│   ├── db.js                  # Configuração SQLite
│   ├── scripts/               # Scripts utilitários
│   └── package.json
├── 📁 frontend/               # Interface Next.js
│   ├── src/
│   ├── components/
│   └── package.json
├── 📁 database/               # Schemas e migrations
│   └── schemas.sql
├── 📁 tests/                  # Testes automatizados
├── env.example               # Exemplo de variáveis
└── README.md
```

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run start        # Produção
npm run setup-db     # Configurar banco
npm run seed-db      # Popular dados exemplo
npm run test         # Executar testes
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Servidor produção
npm run lint         # Linter
```

## 🔐 Segurança

- ✅ Hash bcrypt para senhas
- ✅ Rate limiting por IP
- ✅ Validação de entrada com Joi
- ✅ Headers de segurança com Helmet
- ✅ Tokens JWT com expiração
- ✅ Logs de auditoria completos
- ✅ Isolamento de dados por cliente

## 📈 API Endpoints

### Autenticação
- `POST /api/login` - Login do usuário
- `POST /api/logout` - Logout
- `GET /api/verify` - Verificar token

### Dashboard
- `GET /api/dashboard/metrics` - Métricas principais
- `GET /api/dashboard/top-products` - Top produtos
- `GET /api/dashboard/top-objections` - Principais objeções
- `GET /api/dashboard/contact-reasons` - Motivos de contato
- `GET /api/dashboard/sales-over-time` - Vendas no tempo
- `GET /api/dashboard/conversations-over-time` - Conversas no tempo

### Exportação
- `GET /api/export/sales` - Exportar vendas
- `GET /api/export/conversations` - Exportar conversas
- `GET /api/export/products` - Exportar produtos
- `GET /api/export/objections` - Exportar objeções

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com watch
npm run test:watch

# Testes de integração
npm run test:integration
```

## 🚀 Deploy

### Desenvolvimento Local
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

### Produção
```bash
# Build frontend
cd frontend && npm run build

# Iniciar serviços
cd backend && npm start
cd frontend && npm start
```

## 📝 Customização

### Adicionar Nova Métrica
1. Atualizar schema em `database/schemas.sql`
2. Criar endpoint em `backend/api.js`
3. Adicionar método no `backend/db.js`
4. Criar componente em `frontend/components/`

### Novo Cliente
```bash
cd backend
npm run add-client -- --email="cliente@email.com" --password="senha123" --name="Nome Cliente"
```

## 🐛 Solução de Problemas

### Backend não inicia
- Verificar se SQLite está instalado
- Verificar variáveis de ambiente
- Verificar porta 3001 disponível

### Frontend não carrega
- Verificar se backend está rodando
- Verificar porta 3000 disponível
- Verificar configurações de CORS

### Login não funciona
- Verificar dados do usuário no banco
- Verificar JWT_SECRET configurado
- Verificar logs de erro

## 📞 Suporte

- 📧 Email: suporte@automact.com
- 📖 Documentação: [Link da documentação]
- 🐛 Issues: [Link do repositório]

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🏆 Desenvolvido por

**Automact** - Especialistas em Automação e IA

---

### 🌟 Se este projeto foi útil, considere dar uma ⭐!

---

## 📊 Status do Projeto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18+-green)
![React](https://img.shields.io/badge/react-18+-blue) 