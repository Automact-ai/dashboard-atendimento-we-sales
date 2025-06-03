# Processos - Dashboard de Atendimento

## 1. Instalação e Setup

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd dashboard-de-atendimento
```

2. **Instale as dependências**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicialize o banco de dados**
```bash
cd backend
npm run setup-db
```

5. **Execute o projeto**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 2. Estrutura do Projeto

```
/
├── docs/                    # Documentação
├── agents/                  # Prompts e configurações de IA
├── backend/                 # API e lógica de negócio
│   ├── api.js              # Rotas principais
│   ├── db.js               # Configuração do banco
│   ├── utils/              # Funções utilitárias
│   └── services/           # Serviços de negócio
├── frontend/               # Interface do usuário
│   ├── pages/              # Páginas Next.js
│   ├── components/         # Componentes React
│   └── public/             # Arquivos estáticos
├── database/               # Scripts de banco
└── tests/                  # Testes automatizados
```

## 3. Uso do Dashboard

### Login
1. Acesse `http://localhost:3000`
2. Insira suas credenciais de cliente
3. O sistema redirecionará para o dashboard personalizado

### Navegação
- **Dashboard Principal**: Visão geral com métricas principais
- **Relatórios**: Análises detalhadas por período
- **Exportação**: Download de dados em CSV
- **Configurações**: Alternar tema e configurações de perfil

### Métricas Disponíveis
1. **Atendimentos**: Total e por período selecionado
2. **Conversas**: Quantidade e evolução temporal
3. **Objeções**: Principais objeções e suas quebras
4. **Vendas**: Performance e produtos mais vendidos
5. **Motivos de Contato**: Categorização dos contatos

## 4. Administração

### Adicionar Novo Cliente
```bash
cd backend
npm run add-client -- --email="cliente@email.com" --password="senha123" --name="Nome Cliente"
```

### Backup do Banco
```bash
cd database
./backup.sh
```

### Logs e Monitoramento
- Logs estão em `backend/logs/`
- Monitoramento via `http://localhost:3001/health`

## 5. Desenvolvimento

### Adição de Novas Métricas
1. Criar migration em `database/migrations/`
2. Atualizar schema em `database/schemas.sql`
3. Adicionar endpoint em `backend/api.js`
4. Criar componente visual em `frontend/components/`

### Testes
```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

### Deploy
```bash
# Build do frontend
cd frontend
npm run build

# Preparar backend para produção
cd backend
npm run build

# Script de deploy
./deploy.sh
```

## 6. Solução de Problemas

### Problemas Comuns
1. **Erro de conexão com banco**: Verificar se SQLite está instalado
2. **Página não carrega**: Verificar se backend está rodando
3. **Login não funciona**: Verificar configurações de sessão

### Logs Importantes
- `backend/logs/error.log`: Erros do sistema
- `backend/logs/access.log`: Logs de acesso
- `frontend/.next/`: Logs do Next.js

### Contato para Suporte
- Email: suporte@automact.com
- Documentação: [URL_DA_DOCUMENTACAO] 