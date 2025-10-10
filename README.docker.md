# Docker Production Setup

This document describes how to run the Niddore Mesa Digital application in production using Docker Compose.

## Services

The docker-compose.yml includes three services:

- **niddore-app**: Next.js application (port 3000)
- **directus**: CMS backend (port 8055)
- **libretranslate**: Translation service (port 5000)

## First Time Setup

1. **Get Directus Token**:
   - Start only Directus: `docker-compose up directus -d`
   - Access http://localhost:8055
   - Login with admin@niddore.com / SmjkHJCr97iEETt3jY5aHkjQ
   - Go to Settings > Access Tokens
   - Create a new token with full permissions
   - Update `.env.production` with the token

2. **Start All Services**:
   ```bash
   docker-compose up -d --build
   ```

## Usage

### Start Services
```bash
docker-compose up -d
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

### View Logs
```bash
docker-compose logs -f
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

## Access URLs

- **Next.js App**: http://localhost:3000
- **Directus Admin**: http://localhost:8055
- **LibreTranslate**: http://localhost:5000

## Environment Variables

Create `.env.production` with:
```
DIRECTUS_URL=http://directus:8055
DIRECTUS_STATIC_TOKEN=your_actual_token_here
```

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
docker-compose ps
```

### View Service Logs
```bash
docker-compose logs [service-name]
```

### Restart a Service
```bash
docker-compose restart [service-name]
```

### Rebuild a Service
```bash
docker-compose up -d --build [service-name]
```
