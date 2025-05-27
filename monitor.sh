#!/bin/bash

echo "=== System CPU Usage ==="
# Print CPU usage summary
top -bn1 | grep "Cpu(s)"

echo "=== Memory Usage ==="
# Show memory usage
free -m

echo "=== Docker Containers Status ==="
# Show running Docker containers (if using Docker)
docker ps

echo "=== Node.js Backend Health Check ==="
# Example: curl your backend health endpoint (adjust URL)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/health || echo "Backend not reachable"

