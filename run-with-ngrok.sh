#!/bin/bash

echo "🚀 Chatbooks Product Ratings - Public Access Setup"
echo "=================================================="
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

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker stop cb-product-ratings-app 2>/dev/null || true
docker rm cb-product-ratings-app 2>/dev/null || true

# Build the Docker image
echo "📦 Building Docker image..."
if docker build -t cb-product-ratings . > /dev/null 2>&1; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi

# Start the container
echo "🚀 Starting the application..."
if docker run -d --name cb-product-ratings-app -p 3000:3000 cb-product-ratings > /dev/null 2>&1; then
    echo "✅ Application started successfully"
else
    echo "❌ Failed to start application"
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
echo "   - Run: docker stop cb-product-ratings-app"
echo "   - Run: docker rm cb-product-ratings-app"
echo ""

# Keep the script running and show the URL periodically
echo "🔄 Keeping the application running... (Press Ctrl+C to stop)"
echo ""

# Function to show status
show_status() {
    echo "📊 Status Check:"
    echo "   🐳 Docker container: $(docker ps --filter name=cb-product-ratings-app --format '{{.Status}}' 2>/dev/null || echo 'Not running')"
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
