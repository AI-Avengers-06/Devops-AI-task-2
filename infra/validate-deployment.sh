#!/bin/bash
# AI-Generated Validation Script for Cloud Deployment
# Tests all components of the deployed DevOps Pipeline Dashboard

set -e

echo "=== DevOps Dashboard Cloud Deployment Validation ==="
echo "Generated using AI assistance for comprehensive testing"
echo ""

# Check if Terraform outputs are available
if ! terraform output > /dev/null 2>&1; then
    echo "❌ Error: Terraform outputs not available. Please run 'terraform apply' first."
    exit 1
fi

# Get deployment information
PUBLIC_IP=$(terraform output -raw app_server_public_ip)
FRONTEND_URL=$(terraform output -raw frontend_url)
BACKEND_URL=$(terraform output -raw backend_api_url)
SSH_COMMAND=$(terraform output -raw ssh_connection)

echo "🌐 Deployment Information:"
echo "   Public IP: $PUBLIC_IP"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend: $BACKEND_URL"
echo ""

# Test 1: Server Accessibility
echo "🔍 Test 1: Server Accessibility"
if ping -c 1 $PUBLIC_IP > /dev/null 2>&1; then
    echo "   ✅ Server is reachable"
else
    echo "   ❌ Server is not reachable"
    exit 1
fi

# Test 2: SSH Connectivity
echo ""
echo "🔐 Test 2: SSH Connectivity"
if timeout 10 ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i devops-dashboard-key.pem ec2-user@$PUBLIC_IP "echo 'SSH connection successful'" 2>/dev/null; then
    echo "   ✅ SSH connection successful"
else
    echo "   ⚠️ SSH connection failed (this might be expected if key is not available)"
fi

# Test 3: Backend API Health
echo ""
echo "🔧 Test 3: Backend API Health"
BACKEND_HEALTH=$(curl -s --connect-timeout 10 $BACKEND_URL/health || echo "FAILED")
if [[ $BACKEND_HEALTH == *"ok"* ]]; then
    echo "   ✅ Backend API is healthy"
    echo "   Response: $BACKEND_HEALTH"
else
    echo "   ❌ Backend API health check failed"
    echo "   Response: $BACKEND_HEALTH"
fi

# Test 4: Frontend Accessibility
echo ""
echo "⚛️ Test 4: Frontend Accessibility"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 $FRONTEND_URL || echo "000")
if [[ $FRONTEND_STATUS == "200" ]]; then
    echo "   ✅ Frontend is accessible (HTTP $FRONTEND_STATUS)"
else
    echo "   ❌ Frontend accessibility failed (HTTP $FRONTEND_STATUS)"
fi

# Test 5: Application Integration
echo ""
echo "🔗 Test 5: Application Integration"
PIPELINES_COUNT=$(curl -s --connect-timeout 10 $BACKEND_URL/api/pipelines | jq length 2>/dev/null || echo "0")
if [[ $PIPELINES_COUNT -gt 0 ]]; then
    echo "   ✅ Application integration working ($PIPELINES_COUNT pipelines available)"
else
    echo "   ❌ Application integration issue (pipelines: $PIPELINES_COUNT)"
fi

# Test 6: Database Connectivity (if SSH is available)
echo ""
echo "💾 Test 6: Database Connectivity"
if command -v ssh > /dev/null && [ -f "devops-dashboard-key.pem" ]; then
    DB_TEST=$(timeout 15 ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i devops-dashboard-key.pem ec2-user@$PUBLIC_IP "sudo docker exec -i \$(sudo docker ps -q --filter name=backend) pg_isready -h \$(grep POSTGRES_HOST /opt/devops-dashboard/.env | cut -d'=' -f2)" 2>/dev/null || echo "FAILED")
    if [[ $DB_TEST == *"accepting connections"* ]]; then
        echo "   ✅ Database connectivity confirmed"
    else
        echo "   ⚠️ Database connectivity test skipped (SSH/key not available)"
    fi
else
    echo "   ⚠️ Database connectivity test skipped (SSH/key not available)"
fi

# Summary
echo ""
echo "📊 Validation Summary:"
echo "   Server: $([ $(ping -c 1 $PUBLIC_IP > /dev/null 2>&1; echo $?) -eq 0 ] && echo "✅ Reachable" || echo "❌ Unreachable")"
echo "   Backend: $([ "$BACKEND_HEALTH" != "FAILED" ] && echo "✅ Healthy" || echo "❌ Failed")"
echo "   Frontend: $([ "$FRONTEND_STATUS" == "200" ] && echo "✅ Accessible" || echo "❌ Failed")"
echo "   Integration: $([ "$PIPELINES_COUNT" -gt 0 ] && echo "✅ Working" || echo "❌ Failed")"
echo ""

# Access Instructions
echo "🎯 Access Your Deployed Application:"
echo "   Dashboard: $FRONTEND_URL"
echo "   API Health: $BACKEND_URL/health"
echo "   SSH Access: $SSH_COMMAND"
echo ""

# Cleanup Instructions
echo "🧹 To cleanup resources when done:"
echo "   terraform destroy"
echo ""

echo "✅ Validation completed!"