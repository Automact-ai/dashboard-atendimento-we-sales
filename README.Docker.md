# Dashboard de Atendimento - Guia Docker

Este guia contém informações sobre como executar o Dashboard de Atendimento usando Docker.

## 📋 Pré-requisitos

- Docker (versão 20.x ou superior)
- Docker Compose (versão 2.x ou superior)
- 4GB de RAM disponível
- 2GB de espaço em disco

## 🚀 Início Rápido

### 1. Configuração Inicial

```bash
# Copiar arquivo de ambiente
cp docker.env.example .env

# (Opcional) Editar configurações
nano .env
```

### 2. Executar a Aplicação

```bash
# Construir e iniciar
./docker-scripts.sh build
./docker-scripts.sh up

# Ou usando docker-compose diretamente
docker-compose up -d --build
```

### 3. Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🛠️ Scripts Utilitários

O arquivo `docker-scripts.sh` fornece comandos úteis:

```bash
# Construir imagens
./docker-scripts.sh build

# Iniciar aplicação
./docker-scripts.sh up

# Parar aplicação
./docker-scripts.sh down

# Ver logs
./docker-scripts.sh logs          # Todos os serviços
./docker-scripts.sh logs frontend # Apenas frontend
./docker-scripts.sh logs backend  # Apenas backend

# Status dos containers
./docker-scripts.sh status

# Backup do banco de dados
./docker-scripts.sh backup

# Reset completo (remove todos os dados)
./docker-scripts.sh reset
```

## 📁 Estrutura dos Arquivos Docker

```
📦 Dashboard de Atendimento
├── 🐳 Dockerfile.frontend        # Imagem do Next.js
├── 🐳 Dockerfile.backend         # Imagem do Express.js
├── 🐳 docker-compose.yml         # Orquestração dos serviços
├── 🐳 .dockerignore              # Arquivos ignorados no build
├── 🐳 docker.env.example         # Variáveis de ambiente exemplo
├── 🐳 docker-scripts.sh          # Scripts utilitários
└── 🐳 README.Docker.md           # Este arquivo
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

Edite o arquivo `.env` para personalizar:

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend
NODE_ENV=production
PORT=3001
JWT_SECRET=sua-chave-jwt-super-segura
SESSION_SECRET=sua-chave-sessao-super-segura

# Database
DB_PATH=./database/dashboard.db

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### Volumes Persistentes

Os seguintes dados são mantidos entre restarts:

- `backend_database/` - Banco de dados SQLite
- `backend_uploads/` - Arquivos enviados pelos usuários
- `backend_logs/` - Logs da aplicação
- `backend_data/` - Dados gerais do backend

### Portas Customizadas

Para alterar as portas, edite o `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:3000"  # Frontend na porta 8080
  backend:
    ports:
      - "8081:3001"  # Backend na porta 8081
```

## 🏗️ Arquitetura dos Dockerfiles

### Frontend (Dockerfile.frontend)

**Multi-stage build otimizado:**

1. **Base**: Imagem Node.js 18 Alpine
2. **Dependencies**: Instala apenas dependências de produção
3. **Builder**: Compila o Next.js com otimizações
4. **Runner**: Imagem final mínima com usuário não-root

**Características:**
- ✅ Output traces para menor tamanho
- ✅ Usuário não-root para segurança
- ✅ Cache otimizado por layers
- ✅ Telemetria desabilitada
- ✅ Headers de segurança

### Backend (Dockerfile.backend)

**Imagem otimizada para Express.js:**

1. **Base**: Node.js 18 Alpine
2. **Sistema**: Dependências necessárias (Python, SQLite)
3. **Segurança**: Usuário não-root
4. **Estrutura**: Diretórios necessários criados

**Características:**
- ✅ SQLite3 compilado nativamente
- ✅ dumb-init para signal handling
- ✅ Estrutura de diretórios automática
- ✅ Cache npm limpo
- ✅ Permissões de segurança

## 🔍 Monitoramento e Logs

### Health Checks

Ambos os serviços possuem health checks:

```bash
# Verificar status de saúde
docker-compose ps

# Ver detalhes do health check
docker inspect dashboard-frontend
docker inspect dashboard-backend
```

### Logs Estruturados

```bash
# Logs em tempo real
docker-compose logs -f

# Logs com timestamp
docker-compose logs -t

# Logs de um serviço específico
docker-compose logs frontend
docker-compose logs backend
```

## 🚨 Troubleshooting

### Problemas Comuns

**1. Porta já em uso:**
```bash
# Verificar processos usando as portas
lsof -i :3000
lsof -i :3001

# Parar containers conflitantes
docker-compose down
```

**2. Permissões de arquivo:**
```bash
# Dar permissão ao script
chmod +x docker-scripts.sh

# Verificar propriedade dos volumes
docker-compose exec backend ls -la /app
```

**3. Erro de build:**
```bash
# Limpar cache do Docker
docker system prune -f

# Rebuild sem cache
docker-compose build --no-cache
```

**4. Banco de dados corrompido:**
```bash
# Fazer backup primeiro
./docker-scripts.sh backup

# Reset completo
./docker-scripts.sh reset
```

### Logs de Debug

Para mais detalhes nos logs:

```bash
# Definir nível de log
echo "LOG_LEVEL=debug" >> .env

# Reiniciar serviços
docker-compose restart
```

## 🔒 Segurança

### Boas Práticas Implementadas

- ✅ Usuários não-root nos containers
- ✅ Secrets não expostos em variáveis de build
- ✅ Network isolada entre serviços
- ✅ Volumes com permissões restritas
- ✅ Health checks para monitoring
- ✅ Resource limits configuráveis

### Configurações de Produção

Para produção, considere:

1. **Reverse Proxy** (Nginx/Traefik)
2. **SSL/TLS** certificados
3. **Rate limiting** adicional
4. **Monitoring** (Prometheus/Grafana)
5. **Backup automatizado**

## 📊 Performance

### Otimizações Implementadas

- **Multi-stage builds** reduzem tamanho final
- **Layer caching** acelera rebuilds
- **Alpine Linux** para imagens menores
- **npm ci** para instalação mais rápida
- **Output traces** do Next.js

### Recursos Recomendados

- **CPU**: 2 cores mínimo
- **RAM**: 4GB mínimo
- **Storage**: SSD recomendado
- **Network**: 100Mbps mínimo

## 🤝 Contribuição

Para contribuir com melhorias nos Dockerfiles:

1. Teste suas alterações localmente
2. Verifique se os health checks passam
3. Documente mudanças significativas
4. Mantenha compatibilidade com versões anteriores

---

**Desenvolvido com ❤️ pela equipe Automact** 