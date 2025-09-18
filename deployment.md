# DevOps Pipeline Dashboard - Cloud Deployment Guide

## Overview

This guide explains how to deploy the DevOps Pipeline Health Dashboard to AWS cloud infrastructure using Terraform (Infrastructure-as-Code). The deployment includes:

- **EC2 Instance**: Application server running Docker containers
- **RDS PostgreSQL**: Managed database service
- **VPC & Networking**: Secure network setup with public/private subnets
- **Security Groups**: Firewall rules for web and database access

## Prerequisites

### 1. AWS Account Setup
- AWS CLI installed and configured
- AWS credentials with appropriate permissions
- Key pair created in your target AWS region

### 2. Required Tools
```bash
# Install Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# Verify installation
terraform --version
```

### 3. AWS Configuration
```bash
# Configure AWS CLI (if not already done)
aws configure
# Enter your AWS Access Key ID, Secret Access Key, Region, and Output format
```

## Deployment Steps

### Step 1: Clone Repository and Navigate to Infrastructure
```bash
git clone https://github.com/AI-Avengers-06/Devops-AI-task-2.git
cd Devops-AI-task-2/infra
```

### Step 2: Create AWS Key Pair
```bash
# Create a new key pair for EC2 access
aws ec2 create-key-pair --key-name devops-dashboard-key --query 'KeyMaterial' --output text > devops-dashboard-key.pem
chmod 400 devops-dashboard-key.pem
```

### Step 3: Customize Variables (Optional)
Edit `terraform.tfvars` to customize your deployment:

```hcl
# terraform.tfvars
aws_region    = "us-east-1"
project_name  = "devops-dashboard"
environment   = "prod"
instance_type = "t3.medium"
admin_cidr    = "YOUR_IP_ADDRESS/32"  # Replace with your IP for security
db_password   = "YourSecurePassword123!"
```

### Step 4: Initialize Terraform
```bash
# Initialize Terraform working directory
terraform init
```

### Step 5: Plan Deployment
```bash
# Review what will be created
terraform plan
```

### Step 6: Deploy Infrastructure
```bash
# Apply the configuration
terraform apply

# Type 'yes' when prompted to confirm deployment
```

### Step 7: Retrieve Connection Information
```bash
# Get deployment outputs
terraform output

# Get application URLs
echo "Frontend URL: $(terraform output -raw frontend_url)"
echo "Backend API URL: $(terraform output -raw backend_api_url)"
echo "SSH Command: $(terraform output -raw ssh_connection)"
```

## Post-Deployment Verification

### 1. Check Application Status
```bash
# SSH into the instance
ssh -i devops-dashboard-key.pem ec2-user@$(terraform output -raw app_server_public_ip)

# Run health check
sudo /opt/devops-dashboard/health-check.sh
```

### 2. Access the Dashboard
Open your browser and navigate to:
- **Frontend Dashboard**: `http://YOUR_PUBLIC_IP:5173`
- **Backend API**: `http://YOUR_PUBLIC_IP:3000/health`

### 3. Verify Database Connection
```bash
# Check application logs
sudo docker logs devops-ai-task-2-backend-1
sudo docker logs devops-ai-task-2-frontend-1
```

## Infrastructure Components

### Network Architecture
```
Internet Gateway
       |
   Public Subnet (10.0.1.0/24)
       |
   EC2 Instance (Application)
       |
   Private Subnet (10.0.2.0/24)
       |
   RDS PostgreSQL
```

### Security Configuration
- **Web Security Group**: Allows HTTP (80), HTTPS (443), Frontend (5173), Backend (3000), SSH (22)
- **Database Security Group**: Allows PostgreSQL (5432) only from web servers
- **VPC**: Isolated network with public and private subnets

### Managed Services Used
- **EC2**: t3.medium instance running Amazon Linux 2
- **RDS**: PostgreSQL 13 on db.t3.micro with automated backups
- **VPC**: Custom VPC with internet gateway and route tables

## AI Tools Used in Development

### 1. GitHub Copilot Prompts
```
# Prompt: "Generate Terraform configuration for AWS EC2 instance with VPC and security groups"
# Result: Complete main.tf with VPC, subnets, security groups, and EC2 instance

# Prompt: "Create user data script to install Docker and deploy containerized application"
# Result: Comprehensive bash script with Docker installation and application deployment

# Prompt: "Generate Terraform variables for configurable AWS infrastructure deployment"
# Result: Complete variables.tf with descriptions and default values
```

### 2. ChatGPT Assistance
- **Infrastructure Planning**: Used to design optimal AWS architecture
- **Security Best Practices**: Guidance on security group configurations
- **Deployment Automation**: Assistance with user data script optimization

### 3. AI-Generated Components
- ✅ Terraform main configuration (`main.tf`)
- ✅ Variables definition (`variables.tf`)
- ✅ Output specifications (`outputs.tf`)
- ✅ EC2 user data script (`user_data.sh`)
- ✅ Production Docker Compose configuration

## Cost Optimization

### Estimated Monthly Costs (us-east-1)
- **EC2 t3.medium**: ~$30/month
- **RDS db.t3.micro**: ~$15/month
- **Data Transfer**: ~$5/month
- **Total Estimated**: ~$50/month

### Cost Saving Tips
```bash
# Stop instances when not needed
terraform destroy  # WARNING: This destroys all resources

# Or use smaller instance types in terraform.tfvars:
instance_type = "t3.small"      # ~$15/month
db_instance_class = "db.t3.micro"  # Already optimized
```

## Troubleshooting

### Common Issues

#### 1. EC2 Instance Not Accessible
```bash
# Check security group rules
aws ec2 describe-security-groups --group-ids $(terraform output -raw security_group_id)

# Verify instance status
aws ec2 describe-instances --instance-ids $(terraform output -raw instance_id)
```

#### 2. Application Not Starting
```bash
# SSH into instance and check logs
ssh -i devops-dashboard-key.pem ec2-user@$(terraform output -raw app_server_public_ip)
sudo tail -f /var/log/cloud-init-output.log
sudo docker logs devops-ai-task-2-backend-1
```

#### 3. Database Connection Issues
```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier devops-dashboard-postgres

# Test database connectivity from EC2
sudo docker exec devops-ai-task-2-backend-1 pg_isready -h $(terraform output -raw database_endpoint)
```

## Security Considerations

### Production Recommendations
1. **Restrict SSH Access**: Update `admin_cidr` to your specific IP address
2. **Database Password**: Use AWS Secrets Manager instead of plain text
3. **SSL/TLS**: Implement HTTPS with SSL certificates
4. **WAF**: Add Web Application Firewall for production workloads
5. **Monitoring**: Enable CloudWatch monitoring and alerts

### Security Best Practices Applied
- ✅ RDS in private subnet
- ✅ Security groups with minimal required access
- ✅ Encrypted EBS volumes
- ✅ Encrypted RDS storage
- ✅ No hardcoded credentials in code

## Cleanup

### Destroy Infrastructure
```bash
# WARNING: This will delete all resources and data
terraform destroy

# Type 'yes' to confirm destruction
```

### Cleanup AWS Resources
```bash
# Delete key pair
aws ec2 delete-key-pair --key-name devops-dashboard-key
rm devops-dashboard-key.pem
```

## Next Steps

1. **Domain Setup**: Configure Route 53 for custom domain
2. **SSL Certificate**: Add ACM certificate for HTTPS
3. **Load Balancer**: Implement ALB for high availability
4. **Auto Scaling**: Configure ASG for scalability
5. **Monitoring**: Set up CloudWatch dashboards and alarms

---

**Deployment completed using AI-native Infrastructure-as-Code approach with Terraform! 🚀**