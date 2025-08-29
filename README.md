# CI/CD Pipeline Health Dashboard

A real-time dashboard for monitoring CI/CD pipeline health, built with modern web technologies and AI assistance.

## Features

- 📊 Real-time pipeline metrics visualization
- ⏱️ Build time and success rate tracking
- 🚨 Automated alerts via Slack and Email
- 📈 Historical data and trends
- 🔄 Support for GitHub Actions and Jenkins

## Architecture

### Tech Stack
- Frontend: React + TypeScript + Material-UI
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Containerization: Docker + Docker Compose

### High-Level Design
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  CI/CD Tool │───>│ REST API     │<───│   Frontend  │
└─────────────┘    │ (Node.js)    │    │   (React)   │
                   └──────────┬───┘    └─────────────┘
                            │
                    ┌───────┴──────┐
                    │  PostgreSQL  │
                    └──────────────┘
```

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/AI-Avengers-06/Devops-AI-task-2.git
   cd Devops-AI-task-2
   ```

2. Set up environment variables:
   ```bash
   # Backend (.env)
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=pipeline_dashboard
   SLACK_WEBHOOK_URL=your_webhook_url
   SMTP_HOST=smtp.example.com
   SMTP_USER=your_email
   SMTP_PASS=your_password
   ```

3. Start with Docker Compose:
   ```bash
   docker compose up -d
   ```

4. Access the dashboard at http://localhost:5173

## AI Tools Usage

This project was developed with the assistance of GitHub Copilot. Key areas where AI helped:

1. Code Generation
   - Database schema design
   - API route implementations
   - React component structure

2. Testing
   - Test case generation
   - Mock data creation
   - Edge case identification

3. Documentation
   - API documentation
   - Setup instructions
   - Architecture diagrams

## Key Assumptions

1. Authentication & Authorization
   - Basic auth for API endpoints
   - Webhook verification for CI/CD tool integration

2. Data Retention
   - Pipeline data retained for 30 days
   - Aggregated metrics stored indefinitely

3. Scalability
   - Single instance deployment
   - Suitable for small to medium teams

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details
