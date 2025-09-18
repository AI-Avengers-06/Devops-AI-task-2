# Output values for Terraform deployment
# AI-Generated to provide essential connection information

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

output "app_server_public_ip" {
  description = "Public IP address of the application server"
  value       = aws_instance.app_server.public_ip
}

output "app_server_public_dns" {
  description = "Public DNS name of the application server"
  value       = aws_instance.app_server.public_dns
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = true
}

output "database_port" {
  description = "RDS instance port"
  value       = aws_db_instance.postgres.port
}

output "frontend_url" {
  description = "URL to access the frontend dashboard"
  value       = "http://${aws_instance.app_server.public_ip}:5173"
}

output "backend_api_url" {
  description = "URL to access the backend API"
  value       = "http://${aws_instance.app_server.public_ip}:3000"
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh -i ${var.key_pair_name}.pem ec2-user@${aws_instance.app_server.public_ip}"
}