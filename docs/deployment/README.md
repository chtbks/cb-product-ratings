# Deployment Guide

This guide covers deploying the CB Product Ratings Widget to production environments.

## 🚀 Production Deployment

### Prerequisites

- Docker installed on your server
- Domain name configured (optional)
- SSL certificate (for HTTPS)

### Docker Deployment

#### 1. Build Production Image

```bash
# Build the production image
docker build -t cb-product-ratings:latest .

# Tag for registry (if using container registry)
docker tag cb-product-ratings:latest your-registry/cb-product-ratings:latest
```

#### 2. Run Production Container

```bash
# Run with port mapping
docker run -d -p 3000:3000 --name cb-product-ratings cb-product-ratings:latest

# Run with environment variables
docker run -d -p 3000:3000 \
  -e REACT_APP_API_BASE_URL=https://your-api.com \
  --name cb-product-ratings \
  cb-product-ratings:latest
```

#### 3. Using Docker Compose

```bash
# Production deployment
docker compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

Create a `.env.production` file:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://your-api.com

# Feature Flags
REACT_APP_FEATURE_ANALYTICS=true
REACT_APP_FEATURE_CACHING=true
REACT_APP_FEATURE_OFFLINE=false

# Performance
REACT_APP_CACHE_TTL=300000
REACT_APP_MAX_CACHE_SIZE=100
```

### Nginx Configuration

For production with Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static assets caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | API base URL | `''` |
| `REACT_APP_FEATURE_ANALYTICS` | Enable analytics | `true` |
| `REACT_APP_FEATURE_CACHING` | Enable caching | `true` |
| `REACT_APP_FEATURE_OFFLINE` | Enable offline mode | `false` |
| `REACT_APP_CACHE_TTL` | Cache TTL in ms | `300000` |
| `REACT_APP_MAX_CACHE_SIZE` | Max cache entries | `100` |

### Performance Tuning

#### Memory Optimization

```bash
# Limit container memory
docker run -d -p 3000:3000 \
  --memory="512m" \
  --memory-swap="1g" \
  cb-product-ratings:latest
```

#### CPU Optimization

```bash
# Limit CPU usage
docker run -d -p 3000:3000 \
  --cpus="1.0" \
  cb-product-ratings:latest
```

## 📊 Monitoring

### Health Checks

```bash
# Basic health check
curl http://localhost:3000

# Detailed health check
curl http://localhost:3000/health
```

### Logging

```bash
# View container logs
docker logs cb-product-ratings

# Follow logs in real-time
docker logs -f cb-product-ratings
```

### Metrics

The application exposes metrics at `/metrics`:

- Request count
- Response time
- Cache hit rate
- Memory usage

## 🔄 Updates and Maintenance

### Rolling Updates

```bash
# Pull latest image
docker pull cb-product-ratings:latest

# Stop current container
docker stop cb-product-ratings

# Start new container
docker run -d -p 3000:3000 --name cb-product-ratings cb-product-ratings:latest
```

### Backup and Recovery

```bash
# Backup container data
docker cp cb-product-ratings:/app/data ./backup/

# Restore from backup
docker cp ./backup/ cb-product-ratings:/app/data
```

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check container logs
docker logs cb-product-ratings

# Check resource usage
docker stats cb-product-ratings
```

#### Performance Issues

```bash
# Monitor resource usage
docker stats cb-product-ratings

# Check memory usage
docker exec cb-product-ratings ps aux
```

#### Network Issues

```bash
# Check port binding
docker port cb-product-ratings

# Test connectivity
curl -I http://localhost:3000
```

### Support

For deployment issues, check:

1. Container logs: `docker logs cb-product-ratings`
2. Resource usage: `docker stats cb-product-ratings`
3. Network connectivity: `curl http://localhost:3000`
4. Environment variables: `docker exec cb-product-ratings env`
