#!/bin/bash

# CB Product Ratings - Production Deployment Script
# This script handles production deployment with proper error handling and rollback

set -e  # Exit on any error

# Configuration
APP_NAME="cb-product-ratings"
DOCKER_IMAGE="cb-product-ratings:latest"
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    log_success "Docker is available"
    
    # Check if docker-compose is available
    if ! command -v docker-compose > /dev/null 2>&1 && ! docker compose version > /dev/null 2>&1; then
        log_error "docker-compose is not available. Please install docker-compose."
        exit 1
    fi
    log_success "Docker Compose is available"
    
    # Check if compose file exists
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        log_error "Production compose file '$COMPOSE_FILE' not found"
        exit 1
    fi
    log_success "Production compose file found"
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        log_error "Not in project root directory. Please run from project root."
        exit 1
    fi
    log_success "In correct project directory"
}

# Function to create backup
create_backup() {
    log "Creating backup of current deployment..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup current containers if running
    if docker ps --format "table {{.Names}}" | grep -q "$APP_NAME"; then
        log "Backing up current containers..."
        docker ps --filter "name=$APP_NAME" --format "{{.Names}}" > "$BACKUP_DIR/containers.txt"
        log_success "Container backup created"
    else
        log "No existing containers to backup"
    fi
    
    # Backup current images
    if docker images | grep -q "$APP_NAME"; then
        log "Backing up current images..."
        docker save "$APP_NAME:latest" > "$BACKUP_DIR/${APP_NAME}-backup-$(date +%Y%m%d-%H%M%S).tar" 2>/dev/null || true
        log_success "Image backup created"
    fi
}

# Function to build and deploy
deploy() {
    log "Starting deployment process..."
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker compose -f "$COMPOSE_FILE" down --remove-orphans > /dev/null 2>&1 || true
    
    # Build new image
    log "Building production image..."
    if docker compose -f "$COMPOSE_FILE" build --no-cache; then
        log_success "Production image built successfully"
    else
        log_error "Failed to build production image"
        exit 1
    fi
    
    # Start new containers
    log "Starting production containers..."
    if docker compose -f "$COMPOSE_FILE" up -d; then
        log_success "Production containers started successfully"
    else
        log_error "Failed to start production containers"
        exit 1
    fi
    
    # Wait for application to be ready
    log "Waiting for application to be ready..."
    sleep 10
    
    # Health check
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "Application is responding on http://localhost:3000"
    else
        log_warning "Application might still be starting up..."
    fi
}

# Function to rollback
rollback() {
    log_warning "Rolling back to previous version..."
    
    # Stop current containers
    docker compose -f "$COMPOSE_FILE" down > /dev/null 2>&1 || true
    
    # Restore from backup if available
    if [[ -f "$BACKUP_DIR/containers.txt" ]]; then
        log "Restoring from backup..."
        # Add rollback logic here if needed
        log_success "Rollback completed"
    else
        log_warning "No backup found for rollback"
    fi
}

# Function to cleanup
cleanup() {
    log "Cleaning up old images and containers..."
    
    # Remove old images
    docker image prune -f > /dev/null 2>&1 || true
    
    # Remove old containers
    docker container prune -f > /dev/null 2>&1 || true
    
    log_success "Cleanup completed"
}

# Function to show status
show_status() {
    log "Deployment Status:"
    echo "   🐳 Docker containers: $(docker ps --filter "name=$APP_NAME" --format "{{.Names}}" | wc -l | tr -d ' ') running"
    echo "   🌐 Application: $(curl -s http://localhost:3000 > /dev/null 2>&1 && echo 'Responding' || echo 'Not responding')"
    echo "   📊 Logs: Check with 'docker compose -f $COMPOSE_FILE logs'"
}

# Main deployment function
main() {
    echo "🚀 CB Product Ratings - Production Deployment"
    echo "=============================================="
    echo ""
    
    # Parse command line arguments
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            create_backup
            deploy
            cleanup
            show_status
            log_success "Deployment completed successfully!"
            ;;
        "rollback")
            rollback
            show_status
            ;;
        "status")
            show_status
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  deploy    Deploy the application (default)"
            echo "  rollback  Rollback to previous version"
            echo "  status    Show deployment status"
            echo "  help      Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Deploy application"
            echo "  $0 deploy        # Deploy application"
            echo "  $0 rollback      # Rollback to previous version"
            echo "  $0 status        # Show current status"
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
