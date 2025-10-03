#!/bin/bash

# Default to development mode
MODE="development"
COMPOSE_FILE="docker-compose.yml"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prod|--production)
            MODE="production"
            COMPOSE_FILE="docker-compose.prod.yml"
            shift
            ;;
        --dev|--development)
            MODE="development"
            COMPOSE_FILE="docker-compose.yml"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dev, --development    Use development mode (default)"
            echo "  --prod, --production    Use production mode"
            echo "  --help, -h              Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                     # Start in development mode"
            echo "  $0 --dev               # Start in development mode"
            echo "  $0 --prod              # Start in production mode"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo "🚀 Chatbooks Product Ratings - Public Access Setup"
echo "=================================================="
echo "📋 Mode: $MODE"
echo "📄 Using: $COMPOSE_FILE"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get the ngrok URL
get_ngrok_url() {
    sleep 3
    if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
        echo "✅ ngrok tunnel is active!"
        echo ""
        echo "📱 Your public URLs:"
        curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data['tunnels']:
        for tunnel in data['tunnels']:
            print(f\"🔗 {tunnel['public_url']} -> {tunnel['config']['addr']}\")
    else:
        print('❌ No tunnels found')
except Exception as e:
    print('❌ Could not parse ngrok response')
" 2>/dev/null || echo "❌ Could not get ngrok URL"
    else
        echo "❌ ngrok web interface not accessible"
        echo "💡 Check the ngrok web interface at: http://localhost:4040"
    fi
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is available"

# Check if docker-compose is available
if ! command_exists docker-compose && ! docker compose version > /dev/null 2>&1; then
    echo "❌ docker-compose is not available. Please install docker-compose."
    exit 1
fi

# Determine which compose command to use
COMPOSE_CMD="docker-compose"
if docker compose version > /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
fi

echo "✅ Docker Compose is available"

# Check if the compose file exists
if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "❌ Compose file '$COMPOSE_FILE' not found"
    echo "💡 Available compose files:"
    ls -la docker-compose*.yml 2>/dev/null || echo "   No docker-compose files found"
    exit 1
fi

echo "✅ Using compose file: $COMPOSE_FILE"
echo ""

# Check if ngrok is installed
if ! command_exists ngrok; then
    echo "❌ ngrok is not installed."
    echo ""
    echo "📥 Installing ngrok..."
    echo "   Please choose your installation method:"
    echo "   1. Homebrew: brew install ngrok/ngrok/ngrok"
    echo "   2. Download: https://ngrok.com/download"
    echo "   3. npm: npm install -g ngrok"
    echo ""
    echo "   After installing, run this script again."
    exit 1
fi

echo "✅ ngrok is installed"

# Check ngrok version and update if needed
echo "🔍 Checking ngrok version..."
NGROK_VERSION=$(ngrok version 2>/dev/null | head -n1 | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "unknown")

if [[ "$NGROK_VERSION" != "unknown" ]]; then
    echo "📋 Current ngrok version: $NGROK_VERSION"
    
    # Try to update ngrok
    echo "🔄 Checking for ngrok updates..."
    if ngrok update > /dev/null 2>&1; then
        echo "✅ ngrok updated successfully"
    else
        echo "ℹ️  ngrok is up to date or update failed (this is okay)"
    fi
else
    echo "ℹ️  Could not determine ngrok version (this is okay)"
fi

echo ""

# Stop any existing containers and clean up
echo "🧹 Cleaning up existing containers..."
$COMPOSE_CMD -f $COMPOSE_FILE down --remove-orphans > /dev/null 2>&1 || true

# Build and start the application using docker-compose
echo "📦 Building and starting the application..."
if $COMPOSE_CMD -f $COMPOSE_FILE up --build -d > /dev/null 2>&1; then
    echo "✅ Application started successfully"
else
    echo "❌ Failed to start application"
    echo "💡 Try running: $COMPOSE_CMD -f $COMPOSE_FILE up --build to see detailed error messages"
    exit 1
fi

# Wait for the app to be ready
echo "⏳ Waiting for application to be ready..."
sleep 5

# Check if the app is responding
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is responding on http://localhost:3000"
else
    echo "⚠️  Application might still be starting up..."
fi

echo ""
echo "🌐 Starting ngrok tunnel..."
echo "📋 This will create a public URL for your app"
echo ""

# Start ngrok in the background
ngrok http 3000 > /dev/null 2>&1 &
NGROK_PID=$!

# Get the public URL
get_ngrok_url

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Your app is now accessible at:"
echo "   🔗 Local: http://localhost:3000"
echo "   🌐 Public: Check the ngrok URL above"
echo "   📊 ngrok Dashboard: http://localhost:4040"
echo ""
echo "🛑 To stop everything:"
echo "   - Press Ctrl+C to stop this script"
echo "   - Run: $COMPOSE_CMD -f $COMPOSE_FILE down"
echo "   - Run: $COMPOSE_CMD -f $COMPOSE_FILE down --volumes (to remove volumes)"
echo ""

# Keep the script running and show the URL periodically
echo "🔄 Keeping the application running... (Press Ctrl+C to stop)"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    echo "🧹 Stopping containers..."
    $COMPOSE_CMD -f $COMPOSE_FILE down > /dev/null 2>&1 || true
    echo "🧹 Stopping ngrok..."
    pkill -f ngrok > /dev/null 2>&1 || true
    echo "✅ Cleanup complete"
    exit 0
}

# Set up signal handlers for cleanup
trap cleanup SIGINT SIGTERM

# Function to show status
show_status() {
    echo "📊 Status Check:"
    echo "   🐳 Docker containers: $($COMPOSE_CMD -f $COMPOSE_FILE ps --services --filter status=running 2>/dev/null | wc -l | tr -d ' ') running"
    echo "   🌐 ngrok tunnel: $(curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1 && echo 'Active' || echo 'Not accessible')"
    echo ""
}

# Show initial status
show_status

# Keep running and show status every 30 seconds
while true; do
    sleep 30
    echo "⏰ $(date '+%H:%M:%S') - Application still running..."
    show_status
done
