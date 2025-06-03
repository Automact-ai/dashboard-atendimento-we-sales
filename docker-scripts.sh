#!/bin/bash

# DASHBOARD DE ATENDIMENTO - SCRIPTS DOCKER
# Scripts utilitários para gerenciar a aplicação dockerizada

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está rodando
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker primeiro."
        exit 1
    fi
}

# Build da aplicação
build() {
    print_status "Construindo imagens Docker..."
    check_docker
    
    docker-compose build --no-cache
    
    print_success "Build concluído com sucesso!"
}

# Subir a aplicação
up() {
    print_status "Iniciando aplicação..."
    check_docker
    
    # Copiar arquivo de ambiente se não existir
    if [ ! -f .env ]; then
        print_warning "Arquivo .env não encontrado. Copiando de docker.env.example..."
        cp docker.env.example .env
    fi
    
    docker-compose up -d
    
    print_success "Aplicação iniciada!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:3001"
}

# Parar a aplicação
down() {
    print_status "Parando aplicação..."
    check_docker
    
    docker-compose down
    
    print_success "Aplicação parada!"
}

# Logs da aplicação
logs() {
    check_docker
    
    if [ "$1" = "frontend" ]; then
        docker-compose logs -f frontend
    elif [ "$1" = "backend" ]; then
        docker-compose logs -f backend
    else
        docker-compose logs -f
    fi
}

# Reset completo (remove volumes)
reset() {
    print_warning "Esta ação removerá todos os dados persistentes!"
    read -p "Você tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Removendo containers e volumes..."
        docker-compose down -v
        docker system prune -f
        print_success "Reset concluído!"
    else
        print_status "Operação cancelada."
    fi
}

# Status da aplicação
status() {
    check_docker
    
    print_status "Status dos containers:"
    docker-compose ps
    
    print_status "\nEspaço utilizado pelo Docker:"
    docker system df
}

# Backup do banco de dados
backup() {
    print_status "Criando backup do banco de dados..."
    
    # Criar diretório de backup se não existir
    mkdir -p ./backups
    
    # Nome do backup com timestamp
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    # Fazer backup dos volumes
    docker run --rm \
        -v dashboard-de-atendimento_backend_database:/data \
        -v $(pwd)/backups:/backup \
        alpine tar czf /backup/$BACKUP_NAME -C /data .
    
    print_success "Backup criado: ./backups/$BACKUP_NAME"
}

# Help
help() {
    echo "DASHBOARD DE ATENDIMENTO - Scripts Docker"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  build     - Construir imagens Docker"
    echo "  up        - Iniciar aplicação"
    echo "  down      - Parar aplicação"
    echo "  logs      - Ver logs (opcional: frontend|backend)"
    echo "  status    - Mostrar status dos containers"
    echo "  reset     - Reset completo (remove dados)"
    echo "  backup    - Backup do banco de dados"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 build"
    echo "  $0 up"
    echo "  $0 logs frontend"
    echo "  $0 down"
}

# Parse de argumentos
case "$1" in
    build)
        build
        ;;
    up)
        up
        ;;
    down)
        down
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    reset)
        reset
        ;;
    backup)
        backup
        ;;
    help|--help|-h)
        help
        ;;
    "")
        help
        ;;
    *)
        print_error "Comando desconhecido: $1"
        help
        exit 1
        ;;
esac 