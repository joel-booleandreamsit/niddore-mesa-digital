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

    if ! sudo docker compose version &> /dev/null; then
        log_error "Docker Compose is not available. Please install Docker Compose first."
        log_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi

    log_success "Docker and Docker Compose are available"
}

# Check if .env exists
check_env_file() {
    if [ -f ".env" ]; then
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

    # Check if .env already exists
    if [ -f ".env" ]; then
        log_warning ".env already exists!"
        read -p "Do you want to overwrite it? (y/N): " overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            log_info "Keeping existing .env file"
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

    # Home Directory Configuration
    echo
    echo "=== Home Directory Configuration ==="
    
    read -p "Home directory path [$(eval echo ~)]: " home_dir
    home_dir=${home_dir:-$(eval echo ~)}
    
    # Expand tilde to full path if needed
    home_dir=$(eval echo "$home_dir")


    # Create .env file
    cat > .env << EOF
# Directus Configuration
DIRECTUS_SECRET=$directus_secret
DIRECTUS_STATIC_TOKEN=your_token_here

# LibreTranslate Configuration
LIBRETRANSLATE_LANGUAGES=$languages
LIBRETRANSLATE_DISABLE_UI=$disable_ui
LIBRETRANSLATE_MEMORY_LIMIT=$memory_limit
LIBRETRANSLATE_MEMORY_RESERVATION=$memory_reservation

# Next.js App Configuration
DIRECTUS_URL=http://directus:8055

# Home Directory Configuration
HOME_DIR=$home_dir
EOF

    log_success "Created .env file"
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

    # Get home directory from .env file or use default
    if [ -f ".env" ]; then
        home_dir=$(grep "^HOME_DIR=" .env | cut -d'=' -f2)
    fi
    if [ -z "$home_dir" ]; then
        home_dir=$(eval echo ~)
        log_info "Using default home directory: $home_dir"
    else
        log_info "Using home directory from .env: $home_dir"
    fi

    # Create Directus directories
    log_info "Checking Directus directories..."
    if [ ! -d "$home_dir/.directus" ]; then
        mkdir -p "$home_dir/.directus"/{database,uploads,extensions}
        log_success "Created Directus directories in $home_dir/.directus/"
    else
        log_info "Directus directories already exist in $home_dir/.directus/"
    fi

    # Copy install directory contents to Directus directories
    if [ -d "install" ]; then
        log_info "Found install directory. Preparing to copy into Directus directories..."

        # Ask if user wants to overwrite database/uploads; default to No
        read -p "Do you want to overwrite Directus database and uploads from install? (y/N): " overwrite_du
        if [[ $overwrite_du =~ ^[Yy]$ ]]; then
            # Create a timestamped backup directory
            ts=$(date +%Y%m%d_%H%M%S)
            backup_root="$home_dir/.directus/backup_$ts"
            mkdir -p "$backup_root"

            # Backup existing database if present
            if [ -d "$home_dir/.directus/database" ] && [ -n "$(ls -A "$home_dir/.directus/database" 2>/dev/null)" ]; then
                mkdir -p "$backup_root/database"
                cp -a "$home_dir/.directus/database/." "$backup_root/database/" || true
                log_success "Backed up existing database to $backup_root/database"
            else
                log_info "No existing database to back up"
            fi

            # Backup existing uploads if present
            if [ -d "$home_dir/.directus/uploads" ] && [ -n "$(ls -A "$home_dir/.directus/uploads" 2>/dev/null)" ]; then
                mkdir -p "$backup_root/uploads"
                cp -a "$home_dir/.directus/uploads/." "$backup_root/uploads/" || true
                log_success "Backed up existing uploads to $backup_root/uploads"
            else
                log_info "No existing uploads to back up"
            fi

            # Perform overwrite copy from install
            if [ -d "install/database" ] && [ "$(ls -A install/database)" ]; then
            cp -r install/database/* "$home_dir/.directus/database/"
                log_success "Copied data files from install directory"
            fi
            if [ -d "install/uploads" ] && [ "$(ls -A install/uploads)" ]; then
            cp -r install/uploads/* "$home_dir/.directus/uploads/"
                log_success "Copied upload files from install directory"
            fi
        else
            log_info "Skipping overwrite of Directus database and uploads"
        fi

        # Always copy extensions if present (not backed up by this prompt)
        if [ -d "install/extensions" ] && [ "$(ls -A install/extensions)" ]; then
            cp -r install/extensions/* "$home_dir/.directus/extensions/"
            log_success "Copied extensions from install directory"
        fi
    else
        log_info "No install directory found, skipping data copy"
    fi    

    # Build and start services
    log_info "Building Docker images and starting services..."
    
    if sudo docker compose up -d --build; then
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
    if sudo docker compose ps | grep -q "Up"; then
        log_success "Services are running!"
        echo
        log_info "Access URLs:"
        echo "  • Next.js App: http://localhost:3000"
        echo "  • Directus Admin: http://localhost:8055"
        echo "  • LibreTranslate: http://localhost:5000"
        echo
        log_warning "Next steps:"
        echo "  1. Access Directus at http://localhost:8055"
        echo "  2. Login with your admin credentials [admin@niddore.com]"
        echo "  3. Go to User Directoy > Choose the admin user > Scroll down to Token"
        echo "  4. Generate a new token > Copy the token > Save the user"
        echo "  5. Update DIRECTUS_STATIC_TOKEN in .env with the newly generated token"
        echo "  6. Restart the app: $0 start"
    else
        log_error "Some services failed to start"
        log_info "Check logs with: sudo docker compose logs"
        exit 1
    fi
}

# Start the project
start_project() {
    log_info "Starting the project..."

    # Check if .env.production exists
    if ! check_env_file; then
        log_error ".env not found!"
        log_info "Please run '$0 install' first to set up the project."
        exit 1
    fi

    # Check Docker
    check_docker

    # Start services
    log_info "Starting services..."
    if sudo docker compose up -d; then
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
    
    if sudo docker compose down; then
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
    
    if sudo docker compose ps; then
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
    sudo docker compose logs -f
}

# Rebuild the project
rebuild_project() {
    log_info "Rebuilding the project..."

    # Check if .env.production exists
    if ! check_env_file; then
        log_error ".env not found!"
        log_info "Please run '$0 install' first to set up the project."
        exit 1
    fi

    # Check Docker
    check_docker

    # Rebuild and start services
    log_info "Rebuilding Docker images and restarting services..."
    
    if sudo docker compose up -d --build; then
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
    echo "  start      Start the project (if already installed)"
    echo "  stop       Stop the project"
    echo "  restart    Restart the project"
    echo "  status     Show project status"
    echo "  logs       Show project logs"
    echo "  rebuild    Rebuild and restart the project"
    echo "  help       Show this help message"
    echo
    echo "Examples:"
    echo "  $0 install    # First time setup"
    echo "  $0 start      # Start the project"
    echo "  $0 logs       # View logs"
    echo "  $0 stop       # Stop the project"
}

# Main script logic
case "${1:-help}" in
    install)
        install_project
        ;;
    start)
        start_project
        ;;
    stop)
        stop_project
        ;;
    restart)
        stop_project
        sleep 2
        start_project
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
