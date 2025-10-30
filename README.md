# EUREKA Platform

**Educational Universal Reasoning Enhanced Knowledge Architecture**

A comprehensive AI-powered educational platform supporting learners from high school through professional education (Medical School, Law School, MBA, Engineering).

---

## 🎯 Platform Overview

EUREKA is a production-grade, full-stack educational platform that combines cutting-edge AI with comprehensive educational support across all academic and professional levels.

### Key Features

- **🤖 AI-Powered Tutoring** - Claude/OpenAI integration with RAG for context-aware help
- **📊 Assessment Engine** - Auto-grading, adaptive testing, and comprehensive evaluation
- **📈 Adaptive Learning** - Personalized learning paths with mastery-based progression
- **💬 Real-time Collaboration** - Interactive learning experiences
- **🔒 Compliance-First** - FERPA, HIPAA, COPPA, ABA built-in from ground up
- **🌐 Multi-Tenant** - Support for institutions at scale

---

## 📚 Educational Tiers

### Academic Path

#### 1. High School (Port 8010)
- Common Core State Standards (CCSS) aligned
- Next Generation Science Standards (NGSS)
- AP course support
- Gamified mastery learning
- COPPA compliance

#### 2. Undergraduate (Port 8011)
- ABET/ACM/IEEE standards
- Lab-based learning with simulations
- Project-based curriculum
- Code autograding
- LTI 1.3 integration

#### 3. Graduate (Port 8012)
- Research advisor tools
- Thesis support with LaTeX export
- Literature review assistance
- Statistical analysis
- IRB compliance workflows

### Professional Path

#### 4. Medical School (Port 8020)
- USMLE Question Bank
- Clinical Case Simulations
- 3D Anatomy Models
- Medical Literature Integration
- Diagnostic Reasoning Practice
- HIPAA compliance

#### 5. Law School (Port 8021)
- Case Law Database
- Legal Writing Feedback
- Moot Court Simulations
- Contract Analysis Tools
- Bar Exam Preparation
- ABA compliance

#### 6. MBA Program (Port 8022)
- Financial Modeling Tools
- Business Case Library
- Market Analysis Simulations
- Team Collaboration Features
- Executive Decision Games

#### 7. Engineering (Port 8023)
- Circuit Simulators
- CAD Integration
- FE/PE Practice Exams
- Engineering Problem Sets
- Lab Simulation Tools
- ABET alignment

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack React Query
- Zustand (state management)

**Backend:**
- FastAPI (Python 3.11)
- PostgreSQL 16 with pgvector
- Redis (caching & jobs)
- Celery (task queue)

**AI/ML:**
- Claude/Anthropic API
- OpenAI
- LiteLLM (model orchestration)
- Vector embeddings with pgvector

**Infrastructure:**
- Docker & docker-compose
- Kubernetes with Helm
- Terraform (IaC)
- ArgoCD (GitOps)

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+
- Python 3.11+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture.git
cd EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture

# Navigate to eureka directory
cd eureka

# Start all services
docker-compose up -d

# Or use the Makefile
make dev
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Add your API keys
# Edit .env and add:
# - ANTHROPIC_API_KEY
# - OPENAI_API_KEY
```

---

## 🌐 Service Ports

### Frontend Applications

| Service | Port | URL |
|---------|------|-----|
| **Main Web App** | 3006* | http://localhost:3006 |
| **Admin Dashboard** | 3001 | http://localhost:3001 |

*Port may vary if 3000-3005 are in use

### Core Backend Services

| Service | Port | URL |
|---------|------|-----|
| **Core API** | 8000 | http://localhost:8000 |
| **AI Tutor** | 8001 | http://localhost:8001 |
| **Assessment Engine** | 8002 | http://localhost:8002 |
| **Adaptive Learning** | 8003 | http://localhost:8003 |
| **Content Service** | 8004 | http://localhost:8004 |
| **Analytics** | 8005 | http://localhost:8005 |

### Academic Tier Services

| Service | Port | URL |
|---------|------|-----|
| **High School** | 8010 | http://localhost:8010 |
| **Undergraduate** | 8011 | http://localhost:8011 |
| **Graduate** | 8012 | http://localhost:8012 |

### Professional Tier Services

| Service | Port | URL |
|---------|------|-----|
| **Medical School** | 8020 | http://localhost:8020 |
| **Law School** | 8021 | http://localhost:8021 |
| **MBA Program** | 8022 | http://localhost:8022 |
| **Engineering** | 8023 | http://localhost:8023 |

### Infrastructure

| Service | Port | URL |
|---------|------|-----|
| **PostgreSQL** | 5432 | localhost:5432 |
| **Redis** | 6379 | localhost:6379 |
| **MinIO (API)** | 9000 | http://localhost:9000 |
| **MinIO (Console)** | 9001 | http://localhost:9001 |
| **OpenSearch** | 9200 | http://localhost:9200 |
| **Kafka** | 9092 | localhost:9092 |

---

## 📁 Project Structure

```
EUREKA/
├── .github/
│   └── workflows/              # GitHub Actions workflows
│       ├── professional-modules-orchestration.yml
│       └── config/
├── modules/                    # Professional tier modules
│   ├── medical-school/
│   ├── law-school/
│   ├── mba/
│   └── engineering/
├── eureka/
│   ├── services/              # Backend microservices
│   │   ├── api-core/         # Core API (8000)
│   │   ├── tutor-llm/        # AI Tutor (8001)
│   │   ├── assess/           # Assessment Engine (8002) ✨ NEW
│   │   ├── adaptive/         # Adaptive Learning (8003)
│   │   ├── content/          # Content Service (8004)
│   │   ├── analytics/        # Analytics (8005)
│   │   ├── tier-hs/          # High School (8010)
│   │   ├── tier-ug/          # Undergraduate (8011)
│   │   ├── tier-grad/        # Graduate (8012)
│   │   ├── pro-med/          # Medical School (8020)
│   │   ├── pro-law/          # Law School (8021)
│   │   ├── pro-mba/          # MBA (8022)
│   │   └── pro-eng/          # Engineering (8023)
│   ├── apps/
│   │   ├── web/              # Next.js web app
│   │   ├── admin/            # Admin dashboard
│   │   └── mobile/           # React Native app
│   ├── ops/
│   │   ├── db/               # Database schemas ✨ NEW
│   │   │   ├── init-assessment-engine.sql
│   │   │   ├── init-pro-med.sql
│   │   │   ├── init-pro-law.sql
│   │   │   ├── init-pro-mba.sql
│   │   │   ├── init-pro-eng.sql
│   │   │   └── init-all-databases.sh
│   │   ├── helm/             # Kubernetes Helm charts
│   │   └── terraform/        # Infrastructure as Code
│   └── docker-compose.yml    # Local development setup
└── README.md                 # This file
```

---

## 🆕 What's New

### Assessment Engine Microservice ✨

A comprehensive assessment and evaluation system now fully integrated:

**Features:**
- ✅ Multiple question types (MCQ, True/False, Short Answer, Essay)
- ✅ Auto-grading with AI-powered essay evaluation
- ✅ Rubric-based grading
- ✅ Adaptive testing
- ✅ Proctoring support
- ✅ Real-time feedback
- ✅ Analytics and reporting

**Database Schemas:**
- Complete PostgreSQL schemas for all services
- Professional tier database initialization
- Migration scripts included

**API Endpoints:**
```
POST   /api/v1/assessments          # Create assessment
GET    /api/v1/assessments          # List assessments
GET    /api/v1/assessments/{id}     # Get assessment
POST   /api/v1/attempts             # Submit attempt
POST   /api/v1/grading/auto         # Auto-grade
GET    /api/v1/questions            # List questions
```

---

## 🛠️ Development

### Running Locally

```bash
# Start infrastructure only
docker-compose up -d db redis minio opensearch

# Start frontend
cd eureka/apps/web
npm install
npm run dev

# Start a specific service
cd eureka/services/assess
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

### Testing

```bash
# Run all tests
make test

# Run specific service tests
cd eureka/services/assess
pytest

# Run with coverage
pytest --cov=app tests/
```

### Database Initialization

The database schemas are automatically initialized when you start the database container. All SQL files in `eureka/ops/db/` are executed in alphabetical order.

To manually initialize:

```bash
cd eureka/ops/db
./init-all-databases.sh
```

---

## 📊 Module Structure

Each professional module in `/modules` contains:

```
module-name/
├── database/        # Database schemas
├── api/             # API endpoints
├── frontend/        # React components
├── docs/            # Documentation
│   └── README.md
├── tests/           # Test files
└── BUILD_INFO.txt   # Build metadata
```

---

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

Key variables:
```bash
# Database
DATABASE_URL=postgresql://eureka:password@localhost:5432/eureka

# Redis
REDIS_URL=redis://localhost:6379/0

# AI Services
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=eureka
S3_SECRET_KEY=eureka_minio_password

# Security
JWT_SECRET=your_jwt_secret_here
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with Claude Code
- Powered by Anthropic Claude and OpenAI
- UI components from shadcn/ui
- Icons from Lucide React

---

## 📞 Support

- **Documentation:** [docs/](eureka/docs/)
- **Issues:** [GitHub Issues](https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/issues)
- **Discussions:** [GitHub Discussions](https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/discussions)

---

## 🗺️ Roadmap

- [x] Core platform architecture
- [x] AI Tutor integration
- [x] Assessment Engine microservice
- [x] Professional tier modules (Medical, Law, MBA, Engineering)
- [x] Academic tier modules (High School, Undergrad, Grad)
- [x] Database schemas for all services
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Video streaming integration
- [ ] Gamification system
- [ ] Multi-language support

---

## 📈 Status

![GitHub last commit](https://img.shields.io/github/last-commit/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture)
![GitHub issues](https://img.shields.io/github/issues/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture)
![GitHub stars](https://img.shields.io/github/stars/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture)

**Current Version:** 1.0.0
**Status:** Active Development
**Last Updated:** October 30, 2024

---

**Made with ❤️ using Claude Code**

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
