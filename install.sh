#!/bin/bash

# Niddore Mesa Digital - Installation and Management Script
# This script handles installation and running of the Docker-based application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        log_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        log_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi

    log_success "Docker and Docker Compose are available"
}

# Check if .env.production exists
check_env_file() {
    if [ -f ".env.production" ]; then
        return 0
    else
        return 1
    fi
}

# Generate a random secret
generate_secret() {
    openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64
}

# Prompt for environment variables
prompt_env_vars() {
    log_info "Setting up environment variables..."
    echo

    # Check if .env.production already exists
    if [ -f ".env.production" ]; then
        log_warning ".env.production already exists!"
        read -p "Do you want to overwrite it? (y/N): " overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            log_info "Keeping existing .env.production file"
            return 0
        fi
    fi

    # Directus Configuration
    echo "=== Directus Configuration ==="
    
    read -p "Directus Secret (press Enter for auto-generated): " directus_secret
    if [ -z "$directus_secret" ]; then
        directus_secret=$(generate_secret)
        log_info "Generated secret: $directus_secret"
    fi

    read -p "Directus Admin Email [admin@niddore.com]: " admin_email
    admin_email=${admin_email:-admin@niddore.com}

    read -p "Directus Admin Password: " admin_password
    while [ -z "$admin_password" ]; do
        log_error "Admin password cannot be empty"
        read -p "Directus Admin Password: " admin_password
    done

    # LibreTranslate Configuration
    echo
    echo "=== LibreTranslate Configuration ==="
    
    read -p "Languages to load [pt,en]: " languages
    languages=${languages:-pt,en}

    read -p "Disable LibreTranslate UI? (y/N): " disable_ui
    disable_ui=${disable_ui:-false}
    if [[ $disable_ui =~ ^[Yy]$ ]]; then
        disable_ui="true"
    else
        disable_ui="false"
    fi

    read -p "Memory limit [1G]: " memory_limit
    memory_limit=${memory_limit:-1G}

    read -p "Memory reservation [512M]: " memory_reservation
    memory_reservation=${memory_reservation:-512M}

    # Create .env.production file
    cat > .env.production << EOF
# Directus Configuration
DIRECTUS_SECRET=$directus_secret
DIRECTUS_ADMIN_EMAIL=$admin_email
DIRECTUS_ADMIN_PASSWORD=$admin_password
DIRECTUS_STATIC_TOKEN=your_token_here

# LibreTranslate Configuration
LIBRETRANSLATE_LANGUAGES=$languages
LIBRETRANSLATE_DISABLE_UI=$disable_ui
LIBRETRANSLATE_MEMORY_LIMIT=$memory_limit
LIBRETRANSLATE_MEMORY_RESERVATION=$memory_reservation

# Next.js App Configuration
DIRECTUS_URL=http://directus:8055
EOF

    log_success "Created .env.production file"
}

# Install the project
install_project() {
    log_info "Starting project installation..."

    # Check prerequisites
    check_docker

    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
        log_error "This doesn't appear to be the project directory."
        log_error "Please run this script from the project root directory."
        exit 1
    fi

    # Set up environment variables
    prompt_env_vars

    # Build and start services
    log_info "Building Docker images and starting services..."
    
    if docker-compose up -d --build; then
        log_success "Services started successfully!"
    else
        log_error "Failed to start services"
        exit 1
    fi

    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 10

    # Check service status
    log_info "Checking service status..."
    if docker-compose ps | grep -q "Up"; then
        log_success "Services are running!"
        echo
        log_info "Access URLs:"
        echo "  • Next.js App: http://localhost:3000"
        echo "  • Directus Admin: http://localhost:8055"
        echo "  • LibreTranslate: http://localhost:5000"
        echo
        log_warning "Next steps:"
        echo "  1. Access Directus at http://localhost:8055"
        echo "  2. Login with your admin credentials"
        echo "  3. Go to Settings > Access Tokens"
        echo "  4. Create a new token with full permissions"
        echo "  5. Update DIRECTUS_STATIC_TOKEN in .env.production"
        echo "  6. Restart the app: $0 run"
    else
        log_error "Some services failed to start"
        log_info "Check logs with: docker-compose logs"
        exit 1
    fi
}

# Run the project
run_project() {
    log_info "Starting the project..."

    # Check if .env.production exists
    if ! check_env_file; then
        log_error ".env.production not found!"
        log_info "Please run '$0 install' first to set up the project."
        exit 1
    fi

    # Check Docker
    check_docker

    # Start services
    log_info "Starting services..."
    if docker-compose up -d; then
        log_success "Services started successfully!"
        echo
        log_info "Access URLs:"
        echo "  • Next.js App: http://localhost:3000"
        echo "  • Directus Admin: http://localhost:8055"
        echo "  • LibreTranslate: http://localhost:5000"
    else
        log_error "Failed to start services"
        exit 1
    fi
}

# Stop the project
stop_project() {
    log_info "Stopping the project..."
    
    if docker-compose down; then
        log_success "Project stopped successfully!"
    else
        log_error "Failed to stop project"
        exit 1
    fi
}

# Show project status
show_status() {
    log_info "Project status:"
    echo
    
    if docker-compose ps; then
        echo
        log_info "Access URLs:"
        echo "  • Next.js App: http://localhost:3000"
        echo "  • Directus Admin: http://localhost:8055"
        echo "  • LibreTranslate: http://localhost:5000"
    else
        log_error "Failed to get project status"
        exit 1
    fi
}

# Show logs
show_logs() {
    log_info "Showing project logs (Press Ctrl+C to exit):"
    docker-compose logs -f
}

# Rebuild the project
rebuild_project() {
    log_info "Rebuilding the project..."

    # Check if .env.production exists
    if ! check_env_file; then
        log_error ".env.production not found!"
        log_info "Please run '$0 install' first to set up the project."
        exit 1
    fi

    # Check Docker
    check_docker

    # Rebuild and start services
    log_info "Rebuilding Docker images and restarting services..."
    
    if docker-compose up -d --build; then
        log_success "Project rebuilt and started successfully!"
        echo
        log_info "Access URLs:"
        echo "  • Next.js App: http://localhost:3000"
        echo "  • Directus Admin: http://localhost:8055"
        echo "  • LibreTranslate: http://localhost:5000"
    else
        log_error "Failed to rebuild project"
        exit 1
    fi
}

# Show help
show_help() {
    echo "Niddore Mesa Digital - Installation and Management Script"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  install    Install and set up the project (first time)"
    echo "  run        Start the project (if already installed)"
    echo "  stop       Stop the project"
    echo "  restart    Restart the project"
    echo "  status     Show project status"
    echo "  logs       Show project logs"
    echo "  rebuild    Rebuild and restart the project"
    echo "  help       Show this help message"
    echo
    echo "Examples:"
    echo "  $0 install    # First time setup"
    echo "  $0 run        # Start the project"
    echo "  $0 logs       # View logs"
    echo "  $0 stop       # Stop the project"
}

# Main script logic
case "${1:-help}" in
    install)
        install_project
        ;;
    run)
        run_project
        ;;
    stop)
        stop_project
        ;;
    restart)
        stop_project
        sleep 2
        run_project
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    rebuild)
        rebuild_project
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac
