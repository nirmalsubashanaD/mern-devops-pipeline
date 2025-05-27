# #!/bin/bash

# echo "=== System CPU Usage ==="
# # Print CPU usage summary
# top -bn1 | grep "Cpu(s)"

# echo "=== Memory Usage ==="
# # Show memory usage
# free -m

# echo "=== Docker Containers Status ==="
# # Show running Docker containers (if using Docker)
# docker ps

# echo "=== Node.js Backend Health Check ==="
# # Example: curl your backend health endpoint (adjust URL)
# curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/health || echo "Backend not reachable"

#!/bin/bash

LOG_FILE="monitor.log"
THRESHOLD_CPU=80
THRESHOLD_MEM=80
BACKEND_URL="http://localhost:5000/health"

log() {
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
  LEVEL=$1
  MESSAGE=$2
  echo "$TIMESTAMP [$LEVEL] $MESSAGE" | tee -a "$LOG_FILE"
}

log "INFO" "=== Starting Monitoring Script ==="

# CPU Usage
CPU_IDLE=$(top -bn1 | grep "Cpu(s)" | awk '{print $8}' | cut -d'.' -f1)
CPU_USAGE=$((100 - CPU_IDLE))
log "INFO" "CPU Usage: ${CPU_USAGE}%"
if [ "$CPU_USAGE" -gt "$THRESHOLD_CPU" ]; then
  log "WARNING" "High CPU usage detected: ${CPU_USAGE}%"
fi

# Memory Usage
MEMORY_USED=$(free | awk '/Mem/{printf("%.0f"), $3/$2 * 100.0}')
log "INFO" "Memory Usage: ${MEMORY_USED}%"
if [ "$MEMORY_USED" -gt "$THRESHOLD_MEM" ]; then
  log "WARNING" "High memory usage detected: ${MEMORY_USED}%"
fi

# Docker Containers Status
log "INFO" "Checking Docker container status:"
docker ps --format '{{.Names}} - {{.Status}}' | while read line; do
  log "INFO" "$line"
done

# Backend Health Check
log "INFO" "Checking backend health at ${BACKEND_URL}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
  log "INFO" "Backend is healthy (HTTP 200)"
else
  log "ERROR" "Backend health check failed (HTTP ${HTTP_CODE})"
fi

# Simulate an incident (optional for 95–100%)
# log "INFO" "Simulating incident: Stopping backend temporarily..."
# docker stop backend_container_name && sleep 5 && docker start backend_container_name

log "INFO" "=== Monitoring Complete ==="
