# Node.js Multi-Stage Build Command Reference Guide

### Project Content Table
- [Core Build Operations](#core-build-operations)
- [Container Management](#container-management)
- [Testing and Verification](#testing-and-verification)
- [Production Operations](#production-operations)
- [Troubleshooting](#troubleshooting)

> **Author**: [Md Toriqul Islam](https://linkedin.com/in/thetoriqul)  
> **Description**: Command reference for Node.js application multi-stage Docker builds  
> **Note**: Review commands carefully before execution in your environment

## Core Build Operations

### Building the Docker Image
```bash
# Build with default tag
docker build -t node-app .

# Build with specific version tag
docker build -t node-app:1.0 .

# Build with no cache
docker build --no-cache -t node-app .

# Verify build completion
docker images | grep node-app
```

### Managing Build Cache
```bash
# Remove build cache
docker builder prune -f

# Build with specific target stage
docker build --target build -t node-app:build .

# View build history
docker history node-app
```

## Container Management

### Running Containers
```bash
# Run in detached mode
docker run -d -p 3000:3000 node-app

# Run with specific hostname & container name
docker run -d -p 3000:3000 --hostname TheToriqul --name my-node-app node-app

# Run with environment variables
docker run -d -p 3000:3000 -e PORT=3000 node-app

# Verify container status
docker ps -a | grep node-app
```

### Container Operations
```bash
# Stop container
docker stop $(docker ps -q --filter ancestor=node-app)

# Remove container
docker rm $(docker ps -aq --filter ancestor=node-app)

# View container logs
docker logs $(docker ps -q --filter ancestor=node-app)

#You can also use this cleanup version that will remove any existing container with the same name before running.
docker rm -f $(docker ps -aq --filter ancestor=node-app) 2>/dev/null; docker build -t node-app . && docker run -d -p 3000:3000 --hostname TheToriqul node-app
```


## Testing and Verification

### Application Testing
```bash
# Test HTTP endpoint
curl http://localhost:3000

# Monitor container health
docker inspect $(docker ps -q --filter ancestor=node-app)

# View container resource usage
docker stats $(docker ps -q --filter ancestor=node-app)
```

### Image Analysis
```bash
# View image layers
docker image inspect node-app

# Check image size
docker images node-app --format "{{.Size}}"

# Export container filesystem
docker export $(docker ps -q --filter ancestor=node-app) > node-app.tar
```

## Production Operations

### Image Management
```bash
# Tag for production
docker tag node-app:latest node-app:prod

# Save image to file
docker save node-app:prod > node-app-prod.tar

# Load image from file
docker load < node-app-prod.tar
```

### Cleanup Operations
```bash
# Remove unused images
docker image prune -f

# Remove all related containers
docker rm -f $(docker ps -aq --filter ancestor=node-app)

# Clean all unused build cache
docker builder prune -f
```

## Troubleshooting

### Debugging Commands
```bash
# Enter running container
docker exec -it $(docker ps -q --filter ancestor=node-app) /bin/sh

# View container processes
docker top $(docker ps -q --filter ancestor=node-app)

# Check container networking
docker network inspect bridge
```

## Learning Notes

1. Multi-stage builds significantly reduce final image size
2. Use `node:slim` for production to minimize attack surface
3. Layer caching optimizes build time
4. Always verify container health after deployment
5. Maintain clean image and container states

---

> 💡 **Best Practice**: Always tag images with specific versions for production deployments

> ⚠️ **Warning**: Remove sensitive data from intermediate build stages

> 📝 **Note**: Commands assume default network and port configurations