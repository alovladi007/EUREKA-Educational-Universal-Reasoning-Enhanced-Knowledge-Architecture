# 🚀 EUREKA Test Prep Platform

An adaptive, AI-powered test preparation platform with intelligent question banking, personalized learning paths, comprehensive analytics, and subscription-based content access.

## Features

### 🎯 Subscription Models
- **Option 1**: Test Prep (Videos + Notes) OR QBank Only  
- **Option 2**: Complete Bundle (Everything)

### 🤖 Adaptive Learning
- **Adaptive Learning Engine**: IRT-based difficulty adjustment
- **Smart Question Bank**: 10,000+ categorized questions across multiple exams
- **Performance Analytics**: Real-time progress tracking
- **AI Explanations**: LLM-powered answer explanations

### 📚 Study Tools
- **Exam Simulator**: Timed practice tests
- **Study Planner**: Personalized schedules
- **Video Content**: Premium instructional videos
- **Study Notes**: Comprehensive study materials

### 💳 Payment & Access
- Stripe integration for subscriptions
- Automated billing and renewal
- Webhook handling
- Role-based access control

## 📁 Project Structure

```
services/test-prep/
├── app/
│   ├── api/           # API endpoints
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── adaptive.py
│   │           ├── analytics.py
│   │           ├── ai_content.py
│   │           ├── auth.py
│   │           ├── exams.py
│   │           ├── questions.py
│   │           ├── study_planner.py
│   │           └── users.py
│   ├── core/          # Core configurations
│   │   ├── config.py
│   │   ├── database.py
│   │   └── redis_client.py
│   ├── models/        # Database models
│   │   ├── user.py
│   │   ├── question.py
│   │   ├── question_attempt.py
│   │   └── exam_result.py
│   ├── services/      # Business logic
│   │   ├── adaptive_engine.py
│   │   ├── ai_orchestrator.py
│   │   ├── analytics_service.py
│   │   └── study_planner.py
│   ├── ml/            # Machine learning
│   │   └── adaptive_engine.py
│   └── utils/         # Utilities
├── qbank/             # Question banks
│   ├── calibration/   # IRT-calibrated questions
│   ├── questions/     # Question data
│   └── scripts/       # Import/generation scripts
├── tests/
├── requirements.txt
└── docker-compose.yml
```

## 🚀 Quick Start

### Backend Setup
```bash
cd services/test-prep
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (if applicable)
python -m alembic upgrade head

# Start the server
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8200 --reload
```

### Docker Setup
```bash
docker-compose up -d
```

### Frontend Integration
The test-prep service integrates with the EUREKA Next.js frontend at:
- Dashboard: `/eureka/apps/web/src/app/dashboard/test-prep/`
- API Client: `/eureka/apps/web/src/lib/api-client.ts`

## 🔧 Tech Stack

- **Backend**: FastAPI, PostgreSQL, Redis, SQLAlchemy
- **Frontend**: React, Next.js, TailwindCSS
- **ML/AI**: scikit-learn, NumPy, SciPy (IRT algorithms)
- **Infrastructure**: Docker, Uvicorn

## 🎯 Supported Exams

- **GRE** (Graduate Record Examination)
- **GMAT** (Graduate Management Admission Test)  
- **LSAT** (Law School Admission Test)
- **MCAT** (Medical College Admission Test)
- **SAT** (Scholastic Assessment Test)

## 📊 API Endpoints

### Authentication & Users
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me/stats` - Get user statistics
- `GET /api/v1/users/me/progress` - Get user progress

### Adaptive Learning
- `POST /api/v1/adaptive/next-question` - Get next adaptive question
- `POST /api/v1/adaptive/submit-answer` - Submit answer and update ability
- `GET /api/v1/adaptive/learning-path` - Get personalized learning path

### Analytics
- `GET /api/v1/analytics/performance` - Performance analytics
- `GET /api/v1/analytics/topics` - Topic-level mastery
- `GET /api/v1/analytics/trends` - Performance trends

### Study Planning
- `POST /api/v1/study-planner/generate` - Generate study plan
- `GET /api/v1/study-planner/recommendations` - Get study recommendations

### AI Content
- `POST /api/v1/ai/generate/questions` - Generate AI questions
- `POST /api/v1/ai/explain` - Get AI explanation

## 🧪 Testing

```bash
pytest tests/
```

## 📝 License

MIT License

---

**Part of the EUREKA Educational Platform**  
For complete platform documentation, see the main EUREKA repository.
