# Testing Guide

This document provides step-by-step instructions to verify all functionalities of the CI/CD Pipeline Health Dashboard.

## Prerequisites
1. Docker and Docker Compose installed
2. A Slack webhook URL (for alert testing)
3. SMTP credentials (for email alert testing)
4. GitHub repository with Actions enabled (for GitHub integration testing)

## Step 1: Start the Application

1. Clone and start the application:
```bash
# Clone the repository
git clone https://github.com/AI-Avengers-06/Devops-AI-task-2.git
cd Devops-AI-task-2

# Create environment files
cp backend/.env.example backend/.env
# Edit backend/.env with your Slack and SMTP credentials

# Start the application
docker-compose up -d
```

2. Verify services are running:
```bash
docker-compose ps
# Should show all services (backend, frontend, db) as "running"
```

## Step 2: Database Initialization

1. Verify database setup:
```bash
# Connect to PostgreSQL container
docker-compose exec db psql -U user -d pipeline_dashboard

# List tables
\dt

# Should show:
# - pipelines
# - executions
# - alerts
```

## Step 3: Backend API Testing

1. Test health check endpoint:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok"}
```

2. Test pipeline listing:
```bash
curl http://localhost:3000/api/pipelines
# Should return array of pipelines
```

3. Test metrics endpoint:
```bash
# Replace <pipeline_id> with an actual ID from previous response
curl http://localhost:3000/api/pipelines/<pipeline_id>/metrics
# Should return success rate, build time, and status metrics
```

4. Test webhook endpoint:
```bash
curl -X POST http://localhost:3000/api/pipelines/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline_id": 1,
    "status": "success",
    "start_time": "2023-08-28T10:00:00Z",
    "end_time": "2023-08-28T10:05:00Z",
    "logs": "Test execution"
  }'
# Should return the created execution record
```

## Step 4: Frontend Verification

1. Access the dashboard:
   - Open http://localhost:5173 in your browser
   - Verify you see the dashboard with metrics

2. Check real-time updates:
   - Execute the webhook curl command from Step 3
   - Dashboard should update automatically without refresh

3. Verify metrics display:
   - Success/Failure rate should be visible
   - Average build time should be calculated correctly
   - Last build status should reflect the most recent execution

4. Check execution history:
   - Scroll through recent executions
   - Click "View Logs" to see execution details

## Step 5: Alert System Testing

1. Test Slack alerts:
```bash
# Trigger a failure
curl -X POST http://localhost:3000/api/pipelines/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline_id": 1,
    "status": "failure",
    "start_time": "2023-08-28T10:00:00Z",
    "end_time": "2023-08-28T10:05:00Z",
    "logs": "Build failed"
  }'
# Check your Slack channel for the alert
```

2. Test email alerts:
   - The same failure webhook should trigger an email alert
   - Check the configured email address for notifications

## Step 6: CI/CD Integration Testing

1. GitHub Actions Integration:
```bash
# Copy the report-status.yml to your test repository
cp .github/workflows/report-status.yml /path/to/test/repo/.github/workflows/

# Add DASHBOARD_URL secret in GitHub repository settings
# Value: http://your-dashboard-url:3000

# Push a change to trigger the workflow
git push origin main

# Monitor the dashboard for the new execution
```

2. Jenkins Integration:
   - Add the post block from docs/jenkins-integration.md to your Jenkinsfile
   - Run a Jenkins build
   - Verify the execution appears in the dashboard

## Common Issues and Verification

1. If metrics aren't showing:
   - Check browser console for errors
   - Verify backend API responses
   - Check database connectivity

2. If real-time updates aren't working:
   - Check WebSocket connection in browser DevTools
   - Verify backend WebSocket service is running

3. If alerts aren't being sent:
   - Check backend logs for error messages
   - Verify Slack webhook URL and SMTP credentials
   - Check alert configuration in the database

## Running Automated Tests

1. Backend tests:
```bash
cd backend
npm test
```

2. Frontend tests:
```bash
cd frontend
npm test
```

## Monitoring Tools

1. Check application logs:
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f db
```

2. Monitor database:
```bash
docker-compose exec db psql -U user -d pipeline_dashboard
# Then use SQL queries to check data:
SELECT * FROM executions ORDER BY start_time DESC LIMIT 5;
```

If any step fails, check the respective logs and configuration files. Each component (backend, frontend, database) has its own logging that can help identify issues.
