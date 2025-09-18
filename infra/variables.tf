# Variables for Terraform Configuration
# AI-Generated using GitHub Copilot assistance

variable "aws_region" {
  description = "AWS region for resource deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project for resource tagging"
  type        = string
  default     = "devops-dashboard"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for private subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "instance_type" {
  description = "EC2 instance type for application server"
  type        = string
  default     = "t3.medium"
}

variable "key_pair_name" {
  description = "Name of AWS key pair for EC2 access"
  type        = string
  default     = "devops-dashboard-key"
}

variable "admin_cidr" {
  description = "CIDR block for admin SSH access"
  type        = string
  default     = "0.0.0.0/0"  # Change this to your IP for security
}

# Database variables
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for RDS"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "pipeline_dashboard"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
  default     = "SecurePassword123!"
}

variable "key_name" {
  description = "Name of AWS key pair for EC2 access"
  type        = string
  default     = "devops-dashboard-key"
}

variable "app_name" {
  description = "Application name for tagging"
  type        = string
  default     = "devops-dashboard"
}

variable "region" {
  description = "AWS region for resource deployment"
  type        = string
  default     = "us-east-1"
}

variable "allowed_ip" {
  description = "CIDR block for allowed access"
  type        = string
  default     = "0.0.0.0/0"
}

variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {
    Project     = "DevOps-Dashboard"
    Environment = "Production"
    Owner       = "Rohit-kumar"
  }
}

variable "postgres_version" {
  description = "PostgreSQL version for RDS"
  type        = string
  default     = "15.14"
}