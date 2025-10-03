#!/bin/bash

# Development Docker Script for cb-product-ratings
# This script starts the development environment with live reloading

echo "🚀 Starting cb-product-ratings development environment..."
echo "📁 Mounting src directory for live reloading"
echo "🌐 Application will be available at http://localhost:3000"
echo ""

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start the development environment
echo "🔨 Building and starting development container..."
docker compose up --build

echo ""
echo "✅ Development environment started!"
echo "💡 Make changes to any file in the src/ directory and see them live!"
echo "🛑 Press Ctrl+C to stop the development server"
