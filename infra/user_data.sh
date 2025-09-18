#!/bin/bash
# AI-Generated User Data Script for EC2 Instance
# Deploys DevOps Pipeline Dashboard with Docker
# Generated using GitHub Copilot assistance

# Update system packages
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
yum install -y git

# Create application directory
mkdir -p /opt/devops-dashboard
cd /opt/devops-dashboard

# Clone the repository
git clone https://github.com/AI-Avengers-06/Devops-AI-task-2.git .

# Get the public IP address of this instance
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Update frontend production environment with correct IP
cat > frontend/.env.production << EOF
VITE_API_URL=http://$PUBLIC_IP:3000/api
VITE_WS_URL=ws://$PUBLIC_IP:3000
EOF

# Create environment file for production
cat > .env << EOF
# Production Environment Configuration
NODE_ENV=production
POSTGRES_HOST=${db_host}
POSTGRES_DB=${db_name}
POSTGRES_USER=${db_username}
POSTGRES_PASSWORD=${db_password}
POSTGRES_PORT=5432

# Database URL for application
DATABASE_URL=postgresql://${db_username}:${db_password}@${db_host}:5432/${db_name}?sslmode=require

# Application ports
BACKEND_PORT=3000
FRONTEND_PORT=5173
EOF

# Create production Docker Compose file
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=$${DATABASE_URL}
      - POSTGRES_HOST=$${POSTGRES_HOST}
      - POSTGRES_DB=$${POSTGRES_DB}
      - POSTGRES_USER=$${POSTGRES_USER}
      - POSTGRES_PASSWORD=$${POSTGRES_PASSWORD}
      - POSTGRES_PORT=$${POSTGRES_PORT}
    env_file:
      - .env
    restart: unless-stopped
    depends_on:
      - wait-for-db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=production
      - VITE_API_URL=http://$${PUBLIC_IP}:3000/api
      - VITE_WS_URL=ws://$${PUBLIC_IP}:3000
    restart: unless-stopped
    depends_on:
      - backend

  wait-for-db:
    image: postgres:13
    command: ["sh", "-c", "until pg_isready -h $${POSTGRES_HOST} -p $${POSTGRES_PORT} -U $${POSTGRES_USER}; do echo waiting for database; sleep 2; done; echo database is ready"]
    environment:
      - POSTGRES_HOST=$${POSTGRES_HOST}
      - POSTGRES_DB=$${POSTGRES_DB}
      - POSTGRES_USER=$${POSTGRES_USER}
      - POSTGRES_PASSWORD=$${POSTGRES_PASSWORD}
      - POSTGRES_PORT=$${POSTGRES_PORT}
    env_file:
      - .env

networks:
  default:
    driver: bridge
EOF

# Wait for database to be available
echo "Waiting for database to be ready..."
sleep 60

# Build and start the application
docker-compose -f docker-compose.prod.yml up --build -d

# Create a simple health check script
cat > /opt/devops-dashboard/health-check.sh << 'EOF'
#!/bin/bash
echo "=== Health Check Results ==="
echo "Backend Health: $(curl -s http://localhost:3000/health || echo 'FAILED')"
echo "Frontend Status: $(curl -s -o /dev/null -w "%%{http_code}" http://localhost:5173 || echo 'FAILED')"
echo "Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}"
EOF

chmod +x /opt/devops-dashboard/health-check.sh

# Create systemd service for auto-start
cat > /etc/systemd/system/devops-dashboard.service << 'EOF'
[Unit]
Description=DevOps Pipeline Dashboard
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/devops-dashboard
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl enable devops-dashboard.service

# Log deployment completion
echo "DevOps Dashboard deployment completed at $(date)" >> /var/log/deployment.log
echo "Database Host: ${db_host}" >> /var/log/deployment.log
echo "Application URLs:" >> /var/log/deployment.log
echo "- Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5173" >> /var/log/deployment.log
echo "- Backend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000" >> /var/log/deployment.log