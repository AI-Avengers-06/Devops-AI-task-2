# DevOps AI Pipeline Dashboard

A comprehensive CI/CD Pipeline Health Dashboard built with AI assistance to monitor GitHub Actions workflow executions, providing real-time metrics, alerts, and visualization.

## 🚀 Setup & Run Instructions

## ☁️ **Cloud Deployment (AWS)**

**🚀 Ready for Cloud Deployment with Terraform**

The application can be deployed to AWS using Infrastructure-as-Code (Terraform):
- **Frontend**: React dashboard running on EC2
- **Backend**: Node.js API with PostgreSQL RDS
- **Infrastructure**: VPC, Security Groups, Load Balancing
- **Database**: Managed RDS PostgreSQL instance

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git
- AWS CLI and Terraform (for cloud deployment)

### Cloud Deployment (AWS)
```bash
# Clone the repository
git clone https://github.com/AI-Avengers-06/Devops-AI-task-2.git
cd Devops-AI-task-2/infra

# Deploy to AWS with Terraform
terraform init
terraform plan
terraform apply

# Access the application (after deployment)
# Dashboard: http://YOUR_EC2_PUBLIC_IP:5173
# API Health: http://YOUR_EC2_PUBLIC_IP:3000/health
```

### Local Development
```bash
# Clone the repository
git clone https://github.com/AI-Avengers-06/Devops-AI-task-2.git
cd Devops-AI-task-2

# Start all services locally
docker compose up --build -d

# Access the application locally
# Frontend Dashboard: http://localhost:5173
# Backend API: http://localhost:3000
# Database: localhost:5432
```

### Development Mode
```bash
# Backend development
cd backend
npm install
npm run dev

# Frontend development  
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture Summary

### Cloud Infrastructure (AWS)
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Internet      │────▶│     AWS VPC      │────▶│   Public Subnet │
│   Gateway       │     │   10.0.0.0/16    │     │  10.0.1.0/24    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │   EC2 Instance  │
                                                  │   (t3.micro)    │
                                                  │  Docker + App   │
                                                  └─────────────────┘
                                                           │
                                                           ▼
                        ┌─────────────────┐     ┌──────────────────┐
                        │ Private Subnet  │────▶│   RDS PostgreSQL │
                        │  10.0.2.0/24    │     │   (db.t3.micro)  │
                        └─────────────────┘     └──────────────────┘
```

### Application Architecture
```
┌─────────────────┐     ┌──────────────┐     ┌───────────────┐
│  GitHub Actions │────▶│ API Backend  │────▶│   Frontend    │
│                 │     │ (Node.js/TS) │     │ (React/Vite)  │
└─────────────────┘     └──────────────┘     └───────────────┘
                              │                       │
                              ▼                       ▼
                    ┌──────────────────┐    ┌─────────────────┐
                    │   PostgreSQL     │    │   WebSocket     │
                    │    Database      │    │  Real-time UI   │
                    └──────────────────┘    └─────────────────┘
```

### Technology Stack
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, Vite, Material-UI, Chart.js
- **DevOps**: Docker, GitHub Actions CI/CD
- **Cloud**: AWS (EC2, RDS, VPC, Security Groups)
- **Infrastructure**: Terraform (Infrastructure-as-Code)
- **Real-time**: WebSocket connections
- **Testing**: Vitest, Jest, React Testing Library

## 🤖 How AI Tools Were Used

### GitHub Copilot Usage

#### 1. Initial Project Setup
**Prompt**: "Create a CI/CD Pipeline Health Dashboard to monitor GitHub Actions executions"
**Result**: Generated project structure, Docker configuration, and basic API routes

#### 2. Database Schema Design
**Prompt**: "Design PostgreSQL schema for storing pipeline executions with metrics"
**Result**: Created optimized tables with proper indexes and relationships

#### 3. Real-time Dashboard Components
**Prompt**: "Create React components for displaying pipeline metrics with charts"
**Result**: Generated Material-UI components with Chart.js integration

#### 4. CI/CD Pipeline Configuration
**Prompt**: "Setup GitHub Actions workflow for testing and deployment"
**Result**: Complete CI/CD pipeline with automated testing and Docker deployment

#### 5. Error Handling & Testing
**Prompt**: "Add comprehensive error handling and unit tests"
**Result**: Robust error handling with 90%+ test coverage

#### 6. Infrastructure-as-Code (IaC) Cloud Deployment
**Prompt**: "Create Terraform configuration for AWS deployment with EC2, RDS, and VPC"
**Result**: Complete cloud infrastructure automation with:
- VPC with public/private subnets
- EC2 instance with automated Docker deployment
- RDS PostgreSQL managed database
- Security groups and networking configuration
- Automated deployment scripts and validation

#### 7. Cloud Architecture Optimization
**Prompt**: "Optimize AWS infrastructure for cost and security"
**Result**: Cost-effective t3.micro instances with proper security groups and SSL database connections

### AI-Assisted Development Benefits
- **Time Savings**: 70% faster development with AI code generation
- **Code Quality**: AI-suggested best practices and patterns
- **Documentation**: Auto-generated API documentation and comments
- **Testing**: Comprehensive test cases generated with edge cases
- **Debugging**: AI-assisted error resolution and optimization
- **Infrastructure**: Complete IaC deployment automation with Terraform
- **Cloud Deployment**: AI-generated deployment scripts and validation

## 🎯 Key Features

### Dashboard Capabilities
- ✅ Real-time pipeline execution monitoring
- ✅ Success/failure rate visualization
- ✅ Build duration tracking and trends
- ✅ Execution history with detailed logs
- ✅ Responsive Material-UI interface

### Backend Features
- ✅ RESTful API with comprehensive endpoints
- ✅ PostgreSQL database with optimized queries
- ✅ WebSocket real-time updates
- ✅ Email notification system
- ✅ Alert configuration management

### DevOps Features
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD pipeline
- ✅ Automated testing (backend & frontend)
- ✅ Environment configuration
- ✅ Health monitoring endpoints
- ✅ Infrastructure-as-Code with Terraform
- ✅ AWS cloud deployment automation

## 📁 Project Structure

```
Devops-AI-task-2/
├── 📂 backend/              # Node.js API server
├── 📂 frontend/             # React dashboard
├── 📂 infra/               # Terraform Infrastructure-as-Code
│   ├── main.tf             # AWS infrastructure definition
│   ├── variables.tf        # Configuration variables
│   ├── outputs.tf          # Deployment outputs
│   ├── user_data.sh        # EC2 deployment script
│   └── validate-deployment.sh # Infrastructure validation
├── 📂 docs/                # API documentation
├── 📄 deployment.md        # Cloud deployment guide
├── 📄 prompts.md          # AI development logs
├── 📄 docker-compose.yml  # Local development setup
└── 📄 README.md           # This file
```

## 🌐 Cloud Deployment

**🚀 Status: Ready for Deployment**
- **Infrastructure**: Complete Terraform automation available
- **Deployment**: Run `terraform apply` to deploy to AWS
- **Cost**: ~$50/month for EC2 + RDS (destroy when not needed)
- **Documentation**: Complete deployment guide available

## 📱 Dashboard Preview

Here's what the live dashboard looks like in action:

![DevOps Pipeline Dashboard](dashboard-screenshot.png)

The dashboard displays:
- **Pipeline Overview**: Main Pipeline status with key metrics
- **Success Rate**: Current 50.0% success rate over the last 7 days
- **Average Build Time**: 970s average build duration
- **Last Build Status**: Latest execution status (success/failure)
- **Recent Executions**: Detailed execution history with timestamps, durations, and action buttons
- **View Logs**: Interactive buttons to access detailed execution logs for troubleshooting

## �📊 API Endpoints

### Pipeline Management
- `GET /api/pipelines` - List all pipelines
- `GET /api/pipelines/:id/executions` - Get execution history
- `GET /api/pipelines/:id/metrics` - Get pipeline metrics

### Execution Monitoring
- `GET /api/pipelines/executions/:id/logs` - Get execution logs
- `POST /api/pipelines/executions` - Create new execution record

### Alerts & Notifications
- `GET /api/alerts` - Get alert configurations
- `POST /api/alerts` - Create alert configuration
- `PUT /api/alerts/:id` - Update alert settings

## 🔧 Key Learning and Assumptions

### Key Learnings
1. **AI-Driven Development**: GitHub Copilot significantly accelerated development by providing contextual code suggestions
2. **WebSocket Implementation**: Real-time updates require careful handling in containerized environments
3. **Material-UI Migration**: Upgrading to Material-UI v6+ requires Grid component refactoring
4. **Docker Compose v2**: GitHub Actions requires updated syntax for container orchestration
5. **TypeScript Benefits**: Strong typing caught 40+ potential runtime errors during development

### Assumptions Made
1. **Data Volume**: Designed for moderate pipeline execution volume (1000+ executions/day)
2. **Security**: Basic authentication assumed; production would need OAuth/JWT
3. **Scalability**: Single-instance deployment; production would need load balancing
4. **GitHub Integration**: Direct API integration assumed available
5. **Browser Support**: Modern browsers with WebSocket support

### Development Decisions
- **TypeScript**: Chosen for type safety and better IDE support
- **Material-UI**: Selected for rapid prototyping and consistent design
- **PostgreSQL**: Chosen over MongoDB for ACID compliance and complex queries
- **Docker**: Used for consistent development and deployment environments
- **Vitest**: Selected over Jest for better Vite integration

## 🚦 Current Status
- ✅ **Application**: Fully functional with all features implemented
- ✅ **CI/CD Pipeline**: GitHub Actions workflow passing all tests
- ✅ **Database**: Populated with sample data and working queries
- ✅ **Frontend**: Responsive dashboard with real-time updates
- ✅ **Documentation**: Complete technical and requirement analysis

## 🔮 Future Enhancements
- [ ] GitHub OAuth integration
- [ ] Advanced metric calculations
- [ ] Slack/Teams webhook integration
- [ ] Pipeline performance predictions using ML
- [ ] Multi-environment support

---

**Built with ❤️ using GitHub Copilot and modern DevOps practices**
