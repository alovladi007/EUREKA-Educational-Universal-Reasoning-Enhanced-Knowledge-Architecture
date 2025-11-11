# 🚀 EUREKA Test Prep Platform - Complete Deployment Guide

## 📦 Package Contents

This package contains the complete EUREKA Test Prep platform with:
- **Backend**: FastAPI-based REST API with adaptive learning engine
- **Frontend**: React-based web application
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis for performance optimization
- **ML/AI**: Adaptive learning using IRT and BKT algorithms
- **Docker**: Complete containerization setup

## 🛠️ Quick Start Guide

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- PostgreSQL 15+
- Redis 7+

### 🐳 Docker Deployment (Recommended)

1. **Extract the archive:**
```bash
tar -xzf eureka-test-prep-complete.tar.gz
cd eureka-test-prep
```

2. **Set environment variables:**
```bash
cp .env.example .env
# Edit .env file with your configurations
```

3. **Start with Docker Compose:**
```bash
cd docker
docker-compose up -d
```

4. **Initialize database:**
```bash
docker exec eureka-backend python seed_database.py
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Flower (Celery monitoring): http://localhost:5555

### 💻 Local Development Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup PostgreSQL and Redis
# Update DATABASE_URL and REDIS_URL in .env

# Run migrations
alembic upgrade head

# Seed database
python seed_database.py

# Start server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔑 Default Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### Test Accounts
- Student: `student` / `student123`
- John Doe: `johndoe` / `testpass123`
- Jane Smith: `janesmith` / `testpass123`

## 📊 Key Features

### 1. Adaptive Learning Engine
- **IRT (Item Response Theory)**: Dynamic difficulty adjustment
- **BKT (Bayesian Knowledge Tracing)**: Knowledge state tracking
- **Personalized question selection**: Based on user ability
- **Real-time ability estimation**: Updates after each answer

### 2. Question Bank Management
- 10,000+ questions (expandable)
- Multiple exam types (GRE, GMAT, SAT, etc.)
- Categorized by subject, topic, difficulty
- Community contribution system

### 3. Performance Analytics
- Real-time progress tracking
- Detailed performance reports
- Weakness identification
- Study recommendations

### 4. Exam Simulator
- Timed practice tests
- Realistic exam conditions
- Instant scoring and feedback
- Historical performance comparison

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=postgresql://postgres:password@localhost/eureka_test_prep
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your-openai-api-key

# Frontend
REACT_APP_API_URL=http://localhost:8000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Database Configuration

The platform uses PostgreSQL. To set up:

```sql
CREATE DATABASE eureka_test_prep;
CREATE USER eureka_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE eureka_test_prep TO eureka_user;
```

## 📝 API Documentation

Once running, access comprehensive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token

#### Adaptive Learning
- `POST /api/v1/adaptive/next-question` - Get next adaptive question
- `POST /api/v1/adaptive/submit-answer` - Submit answer and update ability
- `GET /api/v1/adaptive/ability-report` - Get comprehensive ability report

#### Questions
- `GET /api/v1/questions` - List questions with filters
- `POST /api/v1/questions` - Create new question (admin/premium)
- `GET /api/v1/questions/{id}` - Get specific question

#### Analytics
- `GET /api/v1/analytics/user-stats` - User statistics
- `GET /api/v1/analytics/performance-trends` - Performance over time

## 🚀 Production Deployment

### Using Docker

1. **Build production images:**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy with environment-specific config:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment Options

#### AWS ECS
- Use provided Dockerfiles
- Set up RDS for PostgreSQL
- Use ElastiCache for Redis
- Deploy frontend to S3/CloudFront

#### Google Cloud Run
- Build container images
- Use Cloud SQL for PostgreSQL
- Use Memorystore for Redis
- Deploy frontend to Firebase Hosting

#### Heroku
- Use Heroku Postgres
- Add Redis To Go addon
- Deploy with heroku.yml

### Security Considerations

1. **Update all default passwords**
2. **Generate strong SECRET_KEY**
3. **Enable HTTPS in production**
4. **Set up proper CORS origins**
5. **Implement rate limiting**
6. **Enable database backups**
7. **Set up monitoring and logging**

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
npm run cypress:open
```

## 📈 Monitoring

### Application Monitoring
- Use Sentry for error tracking
- Implement custom metrics with Prometheus
- Set up Grafana dashboards

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Monitor Redis hit rates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**Database connection failed:**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

**Redis connection failed:**
- Check Redis is running
- Verify REDIS_URL is correct
- Check firewall rules

**Frontend can't connect to backend:**
- Check REACT_APP_API_URL
- Verify backend is running
- Check CORS settings

**Docker compose fails:**
- Ensure ports 3000, 8000, 5432, 6379 are free
- Check Docker daemon is running
- Verify docker-compose version

## 📞 Support

- Documentation: [docs.eureka-test-prep.com](https://docs.eureka-test-prep.com)
- Issues: GitHub Issues
- Email: support@eureka-test-prep.com

## 🎯 Roadmap

### Phase 1 (Current)
✅ Core adaptive engine
✅ Basic question bank
✅ User authentication
✅ Practice mode

### Phase 2 (Q1 2025)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Social features
- [ ] Payment integration

### Phase 3 (Q2 2025)
- [ ] AI question generation
- [ ] Voice-based practice
- [ ] VR/AR integration
- [ ] Multi-language support

## 🏆 Credits

Built with ❤️ by the EUREKA Team

Special thanks to all contributors and the open-source community!

---

**Version**: 1.0.0
**Last Updated**: November 2024
