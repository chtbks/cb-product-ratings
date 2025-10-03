#!/bin/bash

# Development Docker Script for cb-product-ratings
# This script starts the development environment with live reloading

set -e  # Exit on any error

# Configuration
COMPOSE_FILE="docker-compose.yml"
APP_PORT="3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] ✅ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠️  $1${NC}"
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
        log_error "Development compose file '$COMPOSE_FILE' not found"
        exit 1
    fi
    log_success "Development compose file found"
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        log_error "Not in project root directory. Please run from project root."
        exit 1
    fi
    log_success "In correct project directory"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    log "🛑 Shutting down development environment..."
    docker compose -f "$COMPOSE_FILE" down > /dev/null 2>&1 || true
    log_success "Development environment stopped"
    exit 0
}

# Function to show status
show_status() {
    log "Development Status:"
    echo "   🐳 Docker containers: $(docker compose -f "$COMPOSE_FILE" ps --services --filter status=running 2>/dev/null | wc -l | tr -d ' ') running"
    echo "   🌐 Application: $(curl -s http://localhost:$APP_PORT > /dev/null 2>&1 && echo 'Responding' || echo 'Not responding')"
    echo "   📊 Logs: Check with 'docker compose -f $COMPOSE_FILE logs'"
}

# Main function
main() {
    echo "🚀 CB Product Ratings - Development Environment"
    echo "================================================"
    echo "📁 Mounting src directory for live reloading"
    echo "🌐 Application will be available at http://localhost:$APP_PORT"
    echo ""
    
    # Parse command line arguments
    case "${1:-start}" in
        "start")
            check_prerequisites
            
            # Stop any existing containers
            log "🛑 Stopping existing containers..."
            docker compose -f "$COMPOSE_FILE" down --remove-orphans > /dev/null 2>&1 || true
            
            # Build and start the development environment
            log "🔨 Building and starting development container..."
            if docker compose -f "$COMPOSE_FILE" up --build; then
                log_success "Development environment started!"
            else
                log_error "Failed to start development environment"
                exit 1
            fi
            ;;
        "stop")
            log "🛑 Stopping development environment..."
            docker compose -f "$COMPOSE_FILE" down
            log_success "Development environment stopped"
            ;;
        "restart")
            log "🔄 Restarting development environment..."
            docker compose -f "$COMPOSE_FILE" down
            docker compose -f "$COMPOSE_FILE" up --build -d
            log_success "Development environment restarted"
            ;;
        "status")
            show_status
            ;;
        "logs")
            docker compose -f "$COMPOSE_FILE" logs -f
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  start     Start development environment (default)"
            echo "  stop      Stop development environment"
            echo "  restart   Restart development environment"
            echo "  status    Show development status"
            echo "  logs      Show and follow logs"
            echo "  help      Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Start development environment"
            echo "  $0 start        # Start development environment"
            echo "  $0 stop         # Stop development environment"
            echo "  $0 restart      # Restart development environment"
            echo "  $0 status       # Show current status"
            echo "  $0 logs         # Show logs"
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Set up signal handlers for cleanup
trap cleanup SIGINT SIGTERM

# Run main function with all arguments
main "$@"
