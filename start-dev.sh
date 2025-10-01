#!/bin/bash

echo "🚀 Starting Classic Book Reviews Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose and try again."
    exit 1
fi

echo "✅ Docker is running"
echo "📦 Building and starting the development environment..."
echo ""

# Build and start the containers
docker-compose up --build

echo ""
echo "🎉 Development environment started!"
echo "🌐 Open your browser and navigate to: http://localhost:3000"
echo ""
echo "💡 Tips:"
echo "   - The app will automatically reload when you make changes"
echo "   - Press Ctrl+C to stop the development server"
echo "   - Use 'docker-compose down' to stop and remove containers"

