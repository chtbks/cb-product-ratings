# Scripts Directory

This directory contains all executable scripts for the CB Product Ratings project.

## 📁 Directory Structure

### Development Scripts (`development/`)
- **`docker-dev.sh`**: Comprehensive development environment management

### Deployment Scripts (`deployment/`)
- **`deploy.sh`**: Production deployment with rollback capabilities
- **`run-with-ngrok.sh`**: Run application with ngrok tunneling for public access

## 🚀 Usage

### Development Environment

#### Start Development Server
```bash
# Start development environment (default)
./scripts/development/docker-dev.sh

# Or explicitly
./scripts/development/docker-dev.sh start
```

#### Development Commands
```bash
# Stop development environment
./scripts/development/docker-dev.sh stop

# Restart development environment
./scripts/development/docker-dev.sh restart

# Show development status
./scripts/development/docker-dev.sh status

# View logs
./scripts/development/docker-dev.sh logs

# Show help
./scripts/development/docker-dev.sh help
```

### Production Deployment

#### Deploy Application
```bash
# Deploy to production (default)
./scripts/deployment/deploy.sh

# Or explicitly
./scripts/deployment/deploy.sh deploy
```

#### Deployment Commands
```bash
# Rollback to previous version
./scripts/deployment/deploy.sh rollback

# Show deployment status
./scripts/deployment/deploy.sh status

# Show help
./scripts/deployment/deploy.sh help
```

### Public Access with ngrok

#### Start with ngrok
```bash
# Start in development mode (default)
./scripts/deployment/run-with-ngrok.sh

# Start in production mode
./scripts/deployment/run-with-ngrok.sh --prod

# Show help
./scripts/deployment/run-with-ngrok.sh --help
```

## 🛠️ Features

### Development Script (`docker-dev.sh`)
- ✅ **Prerequisites checking** (Docker, docker-compose, project structure)
- ✅ **Live reloading** with volume mounting
- ✅ **Error handling** with colored output
- ✅ **Multiple commands** (start, stop, restart, status, logs)
- ✅ **Signal handling** for graceful shutdown
- ✅ **Status monitoring** and health checks

### Deployment Script (`deploy.sh`)
- ✅ **Production deployment** with Docker Compose
- ✅ **Backup creation** before deployment
- ✅ **Rollback capabilities** to previous versions
- ✅ **Health checks** and status monitoring
- ✅ **Logging** with timestamps and colors
- ✅ **Cleanup** of old images and containers
- ✅ **Error handling** with proper exit codes

### ngrok Script (`run-with-ngrok.sh`)
- ✅ **Development/Production modes** with different compose files
- ✅ **ngrok integration** with automatic URL detection
- ✅ **Docker Compose support** for both modes
- ✅ **Status monitoring** with periodic checks
- ✅ **Graceful cleanup** on exit
- ✅ **Error handling** and troubleshooting hints

## 📝 Notes

- All scripts are executable and include comprehensive error handling
- Scripts are organized by purpose (development vs deployment)
- Each script includes detailed usage instructions and examples
- Scripts support both `docker-compose` and `docker compose` commands
- All scripts include colored output for better readability
- Signal handlers ensure graceful shutdown on Ctrl+C
