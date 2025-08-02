# Online Judge Setup Guide

## Prerequisites
- Docker and Docker Compose
- Node.js and npm
- MongoDB Atlas account
- AWS ECR repository (for production)

## Environment Setup

### 1. Backend Environment Variables
Create `Backend/.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Docker Compose Setup
Copy template files and update with your values:
```bash
cp docker-compose.yml.template docker-compose.yml
cp docker-compose.prod.yml.template docker-compose.prod.yml
```

Update the following in your docker-compose files:
- `your-ecr-repository` → Your actual ECR repository URL
- `your-server-ip` → Your server IP address
- Environment variables with your actual values

## Development Setup
```bash
# Install dependencies
cd Backend && npm install
cd Frontend && npm install

# Start development servers
cd Backend && npm start
cd Frontend && npm run dev
```

## Production Deployment
```bash
# Build and push Docker images to ECR
docker build -t your-ecr-repository/online-judge-backend:latest ./Backend
docker build -t your-ecr-repository/online-judge-frontend:latest ./Frontend
docker build -t your-ecr-repository/online-judge-compiler:latest ./CompilerBackend

# Deploy on EC2
docker-compose -f docker-compose.prod.yml up -d
```

## Features
- ✅ Problem creation and management
- ✅ Code submission and execution
- ✅ AI code review (mock implementation)
- ✅ User authentication
- ✅ Leaderboard
- ✅ Real-time compilation

## Security Notes
- Never commit `.env` files or docker-compose files with real credentials
- Use template files for reference
- Keep API keys and secrets secure 