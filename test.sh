#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Starting CI/CD Pipeline Health Dashboard Testing..."

# Function to check if a command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 succeeded${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# 1. Check if services are running
echo "1. Checking services..."
docker-compose ps | grep "running"
check_status "Service check"

# 2. Test backend health
echo -e "\n2. Testing backend health..."
curl -s http://localhost:3000/health
check_status "Backend health check"

# 3. Test pipeline listing
echo -e "\n3. Testing pipeline listing..."
curl -s http://localhost:3000/api/pipelines
check_status "Pipeline listing"

# 4. Test webhook
echo -e "\n4. Testing webhook..."
curl -s -X POST http://localhost:3000/api/pipelines/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline_id": 1,
    "status": "success",
    "start_time": "2023-08-28T10:00:00Z",
    "end_time": "2023-08-28T10:05:00Z",
    "logs": "Test execution"
  }'
check_status "Webhook test"

# 5. Test metrics
echo -e "\n5. Testing metrics..."
curl -s http://localhost:3000/api/pipelines/1/metrics
check_status "Metrics test"

# 6. Check database
echo -e "\n6. Testing database..."
docker-compose exec -T db psql -U user -d pipeline_dashboard -c "\dt"
check_status "Database check"

# 7. Run automated tests
echo -e "\n7. Running backend tests..."
cd backend && npm test
check_status "Backend tests"

echo -e "\n8. Running frontend tests..."
cd ../frontend && npm test
check_status "Frontend tests"

echo -e "\n${GREEN}Testing completed successfully!${NC}"
