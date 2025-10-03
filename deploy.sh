#!/bin/bash

# CB Product Ratings Widget - Production Deployment Script
echo "🚀 CB Product Ratings Widget - Production Deployment"
echo "===================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    DOCKER_AVAILABLE=true
    print_info "Docker detected - using containerized build"
else
    DOCKER_AVAILABLE=false
    print_warning "Docker not found - using local build"
fi

# Function to build with Docker
build_with_docker() {
    print_info "Building with Docker..."
    
    # Build production image
    docker build -t cb-product-ratings:latest .
    
    if [ $? -ne 0 ]; then
        print_error "Docker build failed"
        exit 1
    fi
    
    # Create build directory
    mkdir -p build
    
    # Copy built files from container
    docker run --rm -v "$(pwd)/build:/app/build" cb-product-ratings:latest cp -r /app/build/* /app/build/
    
    print_status "Docker build completed"
}

# Function to build locally
build_locally() {
    print_info "Building locally..."
    
    # Install dependencies
    npm ci --only=production
    
    # Build the application
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Local build failed"
        exit 1
    fi
    
    print_status "Local build completed"
}

# Build the application
if [ "$DOCKER_AVAILABLE" = true ]; then
    build_with_docker
else
    build_locally
fi

# Check if build directory exists
if [ ! -d "build" ]; then
    print_error "Build directory not found"
    exit 1
fi

print_status "Build directory ready"

# Check if CSV data exists
if [ ! -f "public/product-ratings.csv" ]; then
    print_warning "CSV data file not found - using default data"
else
    print_status "Data file ready: public/product-ratings.csv"
fi

# Show build information
echo ""
print_info "Build Information:"
echo "===================="

if [ -d "build" ]; then
    echo "Build size: $(du -sh build | cut -f1)"
    echo "Files: $(find build -type f | wc -l)"
fi

if [ -f "public/product-ratings.csv" ]; then
    echo "Data size: $(du -h public/product-ratings.csv | cut -f1)"
fi

# Create deployment package
echo ""
print_info "Creating deployment package..."

# Create deployment directory
DEPLOY_DIR="deployment-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy build files
cp -r build/* "$DEPLOY_DIR/"

# Copy data files
if [ -f "public/product-ratings.csv" ]; then
    cp public/product-ratings.csv "$DEPLOY_DIR/"
fi

# Copy Docker files
cp Dockerfile "$DEPLOY_DIR/"
cp docker-compose.yml "$DEPLOY_DIR/"

# Create deployment README
cat > "$DEPLOY_DIR/README.md" << EOF
# CB Product Ratings Widget - Deployment Package

This package contains the production-ready CB Product Ratings Widget.

## Files Included

- \`build/\` - Production build files
- \`product-ratings.csv\` - Sample data file
- \`Dockerfile\` - Production Docker configuration
- \`docker-compose.yml\` - Docker Compose configuration

## Deployment Options

### Option 1: Static Hosting
Upload the contents of the \`build/\` directory to your static hosting provider.

### Option 2: Docker
\`\`\`bash
docker build -t cb-product-ratings .
docker run -p 3000:3000 cb-product-ratings
\`\`\`

### Option 3: Docker Compose
\`\`\`bash
docker compose up -d
\`\`\`

## Configuration

Set environment variables as needed:
- \`REACT_APP_API_BASE_URL\` - API base URL
- \`REACT_APP_FEATURE_ANALYTICS\` - Enable analytics
- \`REACT_APP_FEATURE_CACHING\` - Enable caching

## Support

For deployment issues, see the documentation in the \`docs/\` directory.
EOF

print_status "Deployment package created: $DEPLOY_DIR"

# Show deployment options
echo ""
print_info "Deployment Options:"
echo "===================="
echo "1. Static Hosting: Upload build/ directory to your hosting provider"
echo "2. Docker: Use the included Dockerfile"
echo "3. Docker Compose: Use docker-compose.yml"
echo "4. Package: Use the created deployment package in $DEPLOY_DIR/"

echo ""
print_info "Next Steps:"
echo "============"
echo "1. Choose your deployment method"
echo "2. Configure environment variables if needed"
echo "3. Test the deployment"
echo "4. Monitor the application"

echo ""
print_status "Ready for production deployment!"
