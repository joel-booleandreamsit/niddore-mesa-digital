# Docker Production Setup

This document describes how to run the Niddore Mesa Digital application in production using Docker Compose.

## Environment Setup

Before running the application, you need to set up environment variables:

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env.production
   ```

2. **Update the values in `.env.production`**:
   - Set `DIRECTUS_SECRET` to a secure random string
   - Set `DIRECTUS_ADMIN_EMAIL` and `DIRECTUS_ADMIN_PASSWORD` for admin access
   - Set `DIRECTUS_STATIC_TOKEN` (get this from Directus admin after first run)
   - Adjust LibreTranslate settings as needed

## Services

The docker-compose.yml includes three services:

- **niddore-app**: Next.js application (port 3000)
- **directus**: CMS backend (port 8055)
- **libretranslate**: Translation service (port 5000)

## Quick Start (Recommended)

Use the installation script for easy setup:

```bash
# First time installation
./install.sh install

# Start the project (after installation)
./install.sh run

# Stop the project
./install.sh stop

# View logs
./install.sh logs

# Show help
./install.sh help
```

## Manual Setup

### First Time Setup

1. **Set up environment variables**:
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your values
   ```

2. **Start all services**:
   ```bash
   docker compose up -d --build
   ```

3. **Get Directus Token**:
   - Access http://localhost:8055
   - Login with your admin credentials
   - Go to Settings > Access Tokens
   - Create a new token with full permissions
   - Update `DIRECTUS_STATIC_TOKEN` in `.env.production`

4. **Restart the app**:
   ```bash
   docker compose restart niddore-app
   ```

## Installation Script Commands

The `install.sh` script provides easy project management:

| Command | Description |
|---------|-------------|
| `./install.sh install` | First-time installation with interactive setup |
| `./install.sh run` | Start the project (if already installed) |
| `./install.sh stop` | Stop all services |
| `./install.sh restart` | Restart the project |
| `./install.sh status` | Show project status and URLs |
| `./install.sh logs` | View real-time logs |
| `./install.sh rebuild` | Rebuild and restart the project |
| `./install.sh help` | Show help message |

### Installation Script Features

- **Interactive setup**: Prompts for all required environment variables
- **Auto-generated secrets**: Creates secure random secrets if not provided
- **Validation**: Checks for Docker installation and project files
- **Error handling**: Clear error messages and exit codes
- **Status checking**: Verifies services are running correctly
- **Colored output**: Easy-to-read status messages
- **Environment file handling**: Uses `.env.production` for all Docker Compose commands
- **Existing file protection**: Prompts before overwriting existing `.env.production`

## Manual Usage

When using Docker Compose commands manually, you need to specify the environment file:

### Start Services
```bash
docker compose --env-file .env.production up -d
```

### Rebuild After Changes
```bash
docker compose --env-file .env.production up -d --build
```

### View Logs
```bash
docker compose --env-file .env.production logs -f
```

### Stop All Services
```bash
docker compose --env-file .env.production down
```

### Stop and Remove Volumes
```bash
docker compose --env-file .env.production down -v
```

**Note**: Docker Compose only automatically loads `.env` files, not `.env.production`. The `--env-file` flag is required to use the production environment variables.

## Access URLs

- **Next.js App**: http://localhost:3000
- **Directus Admin**: http://localhost:8055
- **LibreTranslate**: http://localhost:5000

## Environment Variables

All configuration is done through environment variables in `.env.production`:

- `DIRECTUS_SECRET`: Secret key for Directus
- `DIRECTUS_ADMIN_EMAIL`: Admin email for Directus
- `DIRECTUS_ADMIN_PASSWORD`: Admin password for Directus
- `DIRECTUS_STATIC_TOKEN`: Static token for API access
- `LIBRETRANSLATE_LANGUAGES`: Comma-separated list of languages
- `LIBRETRANSLATE_DISABLE_UI`: Whether to disable LibreTranslate UI
- `LIBRETRANSLATE_MEMORY_LIMIT`: Memory limit for LibreTranslate
- `LIBRETRANSLATE_MEMORY_RESERVATION`: Memory reservation for LibreTranslate

## Security Notes

- Never commit `.env.production` to version control
- Use strong, unique passwords and secrets
- Rotate secrets regularly in production
- Consider using Docker secrets for production deployments

## Network Architecture

All services communicate via the `niddore-network` bridge network:
- Internal communication uses service names (e.g., `http://directus:8055`)
- External access uses localhost ports

## Data Persistence

Directus data is persisted in Docker volumes:
- `directus_data`: Database files
- `directus_uploads`: Uploaded files
- `directus_extensions`: Extensions

## Troubleshooting

### Check Service Status
```bash
docker compose ps
```

### View Service Logs
```bash
docker compose logs [service-name]
```

### Restart a Service
```bash
docker compose restart [service-name]
```

### Rebuild a Service
```bash
docker compose up -d --build [service-name]
```
