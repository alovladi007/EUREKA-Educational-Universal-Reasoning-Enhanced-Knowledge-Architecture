# 🚀 EUREKA Test Prep Platform

An adaptive, AI-powered test preparation platform with intelligent question banking, personalized learning paths, and comprehensive analytics.

## 📁 Project Structure

```
eureka-test-prep/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core configurations
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── ml/            # Machine learning components
│   │   └── utils/         # Utility functions
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utilities
│   └── package.json
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
└── docs/
    └── architecture.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup
```bash
docker-compose up -d
```

## 🔧 Tech Stack

- **Backend**: FastAPI, PostgreSQL, Redis, SQLAlchemy
- **Frontend**: React, Next.js, TailwindCSS, Zustand
- **ML/AI**: scikit-learn, LangChain, OpenAI
- **Infrastructure**: Docker, Nginx

## 📊 Features

- **Adaptive Learning Engine**: IRT-based difficulty adjustment
- **Smart Question Bank**: 10,000+ categorized questions
- **Performance Analytics**: Real-time progress tracking
- **AI Explanations**: LLM-powered answer explanations
- **Exam Simulator**: Timed practice tests
- **Study Planner**: Personalized schedules

## 🎯 Supported Exams (Phase 1)

- GRE (Graduate Record Examination)
- GMAT (Graduate Management Admission Test)
- SAT (Scholastic Assessment Test)

## 📝 License

MIT License
