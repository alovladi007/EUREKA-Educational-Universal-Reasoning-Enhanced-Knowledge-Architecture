# MedAtlas MD 🏥

**Production-grade medical education platform for EUREKA**

A comprehensive medical education platform with modules for preclinical education, clinical clerkships, skills lab simulations, question banks, AI teaching agents, and ML-powered diagnostic tools.

[![CI/CD](https://github.com/your-org/medatlas-md/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-org/medatlas-md/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker & Docker Compose
- pnpm 8+

### First Run

```bash
# 1. Clone the repository
git clone https://github.com/your-org/medatlas-md.git
cd medatlas-md

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start all services
pnpm docker:up

# 5. Wait for services to be healthy (30-60 seconds)
docker compose -f infra/docker/docker-compose.yml ps

# 6. Initialize database
pnpm db:migrate
pnpm db:seed

# 7. Open the application
open http://localhost:3000
```

### Verify Installation

```bash
# Check all services are running
curl http://localhost:8000/health  # API Gateway
curl http://localhost:8001/health  # QBank Service
curl http://localhost:8002/health  # Content Service
curl http://localhost:3000         # Web App
```

## 📦 What's Included

### Applications
- **Web App** (Next.js 15 + React 18) - Student and instructor interface
- **Admin Dashboard** (Next.js 15) - System administration
- **API Gateway** (NestJS) - Authentication, authorization, routing
- **ML Hub** (FastAPI + Python) - Machine learning models and inference

### Services
- **QBank** - Question item banking, IRT scoring, analytics
- **Content** - Course content management, versioning, DRM
- **Cases** - Virtual patient cases, branching logic
- **OSCE** - Clinical skills assessment, checklists, scoring
- **Anatomy3D** - 3D anatomical models, interactive scenes
- **Grading** - Automated grading, rubrics, plagiarism detection
- **Audit** - Compliance logging, HIPAA audit trails

### Packages
- **UI** - Shared React components with shadcn/ui
- **Types** - TypeScript types and Zod schemas
- **SDK-JS** - JavaScript/TypeScript client SDK
- **SDK-Python** - Python client SDK

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     EUREKA Platform                      │
│         (SSO, Org Management, Billing, LTI 1.3)         │
└───────────────────┬─────────────────────────────────────┘
                    │ OIDC / LTI 1.3
┌───────────────────┴─────────────────────────────────────┐
│              MedAtlas MD API Gateway (NestJS)            │
│      (Auth, RBAC, Rate Limiting, Request Routing)        │
└─┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬──────┘
  │     │     │     │     │     │     │     │     │
  │     │     │     │     │     │     │     │     │
┌─▼─┐ ┌─▼─┐ ┌─▼─┐ ┌─▼─┐ ┌─▼─┐ ┌─▼─┐ ┌─▼─┐ ┌─▼─┐ ┌─▼──┐
│QB │ │CT │ │CA │ │OS │ │A3D│ │GR │ │AU │ │ML │ │WK  │
└─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬──┘
  │     │     │     │     │     │     │     │     │
  └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴──────┐
                                                            │
┌───────────────────────────────────────────────────────────▼─┐
│           Infrastructure (Postgres, Redis, MinIO)            │
└──────────────────────────────────────────────────────────────┘

QB = QBank, CT = Content, CA = Cases, OS = OSCE, A3D = Anatomy3D
GR = Grading, AU = Audit, ML = ML Hub, WK = Worker
```

## 🎯 Feature Modules

### 1. Preclinical Academy
- **Basic Sciences**: Anatomy, Physiology, Biochemistry, Pharmacology
- **3D Anatomy**: Interactive 3D models with quizzes and annotations
- **Systems-based**: Cardiovascular, Respiratory, GI, Neuro, etc.
- **Clinical Correlations**: Disease mechanisms, pathophysiology

### 2. Clinical Clerkships & OSCEs
- **Standardized Patients**: Interactive virtual patient encounters
- **OSCE Stations**: Timed clinical skills assessments
- **Checklists**: Evidence-based scoring rubrics
- **Real-time Feedback**: AI-powered performance analysis

### 3. Skills Lab Simulators
- **Procedures**: Suturing, IV insertion, intubation, CPR
- **3D Visualization**: Step-by-step procedural guidance
- **Haptics-ready**: Integration hooks for physical simulators
- **Progress Tracking**: Competency-based advancement

### 4. Question Bank Engine
- **NBME-style Items**: Clinical vignettes with single best answer
- **Item Response Theory**: Difficulty calibration and scoring
- **Performance Analytics**: Strengths, weaknesses, predictions
- **Adaptive Testing**: Dynamic difficulty adjustment

### 5. AI Teaching Agents
- **AI Tutors**: Socratic teaching with citations
- **Auto-grading**: Essay and short answer evaluation
- **Case Writers**: Generate clinical vignettes
- **Viva Practice**: Oral examination simulation

### 6. ML Model Hub
- **Radiology**: X-ray, CT, MRI interpretation demos
- **ECG Analysis**: Arrhythmia detection and classification
- **Dermatology**: Lesion analysis and classification
- **Explainability**: Grad-CAM, LIME, SHAP visualizations

### 7. Curriculum & Content Studio
- **Content Authoring**: Rich text editor with medical templates
- **Version Control**: Git-like versioning for content
- **Citations**: Automatic PubMed/DOI integration
- **DRM**: Access control and usage tracking

### 8. Compliance & Audit
- **RBAC**: Role-based access control (student, resident, faculty, admin)
- **Audit Logs**: Immutable append-only logs
- **HIPAA-ready**: De-identified patient data patterns
- **BAA Templates**: Business Associate Agreement configs

### 9. EUREKA Integration
- **SSO**: OIDC/OAuth2 integration
- **Org Sync**: Organization and user provisioning
- **LTI 1.3**: Learning Management System integration
- **Billing**: Usage tracking and reporting

## 🗄️ Database Schema

### Core Tables

```sql
-- Organizations (from EUREKA)
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  tier VARCHAR(50),
  settings JSONB
);

-- Users (from EUREKA)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  email VARCHAR(255),
  role VARCHAR(50)
);

-- Question Bank
CREATE TABLE qbank_items (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  content JSONB,
  difficulty FLOAT,
  discrimination FLOAT,
  tags TEXT[],
  created_at TIMESTAMP
);

CREATE TABLE qbank_responses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_id UUID REFERENCES qbank_items(id),
  response TEXT,
  is_correct BOOLEAN,
  time_spent INTEGER,
  created_at TIMESTAMP
);

-- Cases
CREATE TABLE cases (
  id UUID PRIMARY KEY,
  title VARCHAR(500),
  presentation TEXT,
  history JSONB,
  physical_exam JSONB,
  labs JSONB,
  imaging JSONB,
  diagnosis VARCHAR(255),
  learning_objectives TEXT[]
);

CREATE TABLE case_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  case_id UUID REFERENCES cases(id),
  state JSONB,
  score INTEGER,
  completed_at TIMESTAMP
);

-- OSCE
CREATE TABLE osce_stations (
  id UUID PRIMARY KEY,
  title VARCHAR(500),
  scenario TEXT,
  checklist JSONB,
  time_limit INTEGER
);

CREATE TABLE osce_attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  station_id UUID REFERENCES osce_stations(id),
  checklist_scores JSONB,
  global_rating INTEGER,
  feedback TEXT,
  completed_at TIMESTAMP
);

-- Anatomy 3D
CREATE TABLE anatomy_scenes (
  id UUID PRIMARY KEY,
  title VARCHAR(500),
  description TEXT,
  model_url VARCHAR(1000),
  annotations JSONB,
  quiz_questions JSONB
);

-- Audit
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP,
  user_id UUID,
  action VARCHAR(100),
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address INET
);
```

## 🔧 Development

### Project Structure

```
medatlas/
├── apps/
│   ├── web/              # Student/Instructor web app
│   ├── admin/            # Admin dashboard
│   ├── api-gateway/      # NestJS API gateway
│   ├── mlhub/            # FastAPI ML service
│   └── worker/           # Background jobs
├── packages/
│   ├── ui/               # Shared React components
│   ├── types/            # TypeScript types
│   ├── sdk-js/           # JS/TS client SDK
│   └── sdk-py/           # Python client SDK
├── services/
│   ├── qbank/            # Question bank
│   ├── content/          # Content management
│   ├── cases/            # Virtual patients
│   ├── osce/             # Clinical skills
│   ├── anatomy3d/        # 3D anatomy
│   ├── grading/          # Auto-grading
│   └── audit/            # Compliance
├── infra/
│   ├── docker/           # Docker Compose
│   ├── k8s/              # Kubernetes manifests
│   ├── terraform/        # Infrastructure as Code
│   └── github/           # GitHub Actions
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── DATA-GOVERNANCE.md
│   └── RUNBOOK.md
└── .tooling/
    ├── eslint/
    ├── prettier/
    └── commitlint/
```

### Common Commands

```bash
# Development
pnpm dev                 # Start all apps in dev mode
pnpm build              # Build all packages and apps
pnpm test               # Run all tests
pnpm test:e2e           # Run E2E tests
pnpm typecheck          # Type check all TypeScript

# Code Quality
pnpm lint               # Lint all code
pnpm lint:fix           # Auto-fix linting issues
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting

# Docker
pnpm docker:up          # Start all services
pnpm docker:down        # Stop all services
pnpm docker:logs        # View service logs

# Database
pnpm db:migrate         # Run migrations
pnpm db:seed            # Seed test data
pnpm db:reset           # Reset and reseed database

# Code Generation
pnpm codegen            # Generate OpenAPI clients
```

### Adding a New Service

```bash
# 1. Generate service from template
npx turbo gen service

# 2. Follow prompts to create service structure

# 3. Add service to docker-compose.yml

# 4. Add service routes to api-gateway

# 5. Generate OpenAPI spec
cd services/your-service
pnpm codegen

# 6. Update SDK packages
cd packages/sdk-js
pnpm codegen
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests for specific package
pnpm test --filter @medatlas/qbank

# Run tests with coverage
pnpm test:coverage
```

### Integration Tests

```bash
# Start test database
docker compose -f infra/docker/docker-compose.test.yml up -d

# Run integration tests
pnpm test:integration

# Cleanup
docker compose -f infra/docker/docker-compose.test.yml down -v
```

### E2E Tests

```bash
# Start all services
pnpm docker:up

# Run E2E tests with Playwright
pnpm test:e2e

# Run specific E2E test
pnpm test:e2e --grep "QBank workflow"

# Debug E2E tests
pnpm test:e2e --debug
```

## 🚀 Deployment

### Local Development

```bash
pnpm docker:up
```

### Staging (Kubernetes)

```bash
# Deploy to staging
kubectl apply -f infra/k8s/staging/

# Check deployment status
kubectl get pods -n medatlas-staging

# View logs
kubectl logs -f deployment/api-gateway -n medatlas-staging
```

### Production (Kubernetes)

```bash
# Deploy to production
kubectl apply -f infra/k8s/production/

# Rolling update
kubectl set image deployment/api-gateway api-gateway=ghcr.io/org/api-gateway:v1.2.3

# Rollback if needed
kubectl rollout undo deployment/api-gateway
```

### Using Terraform

```bash
# Initialize Terraform
cd infra/terraform
terraform init

# Plan changes
terraform plan -var-file=environments/production.tfvars

# Apply changes
terraform apply -var-file=environments/production.tfvars
```

## 📊 Monitoring

### Health Checks

```bash
# API Gateway
curl http://localhost:8000/health

# All services
for port in {8001..8007}; do
  echo "Service on port $port:"
  curl http://localhost:$port/health
done
```

### Metrics

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002
- **Jaeger**: http://localhost:16686 (tracing)

### Logs

```bash
# View all logs
pnpm docker:logs

# View specific service
docker compose -f infra/docker/docker-compose.yml logs -f qbank

# Follow logs in Kubernetes
kubectl logs -f deployment/api-gateway -n medatlas-production
```

## 🔐 Security

### HIPAA Compliance
- ✅ Audit logging for all data access
- ✅ Encryption at rest (database, S3)
- ✅ Encryption in transit (TLS 1.3)
- ✅ Role-based access control
- ✅ De-identified patient data patterns
- ✅ BAA-ready configuration templates

### Authentication & Authorization
- OIDC/OAuth2 integration with EUREKA
- JWT tokens with short expiration
- Role-based access control (RBAC)
- Permission-based authorization
- API key authentication for services

### Data Governance
- No PHI in development/staging
- Synthetic patient data for testing
- Data retention policies
- Right to be forgotten (GDPR)

## 📝 API Documentation

Interactive API documentation available at:

- **API Gateway**: http://localhost:8000/docs
- **QBank**: http://localhost:8001/docs
- **Content**: http://localhost:8002/docs
- **Cases**: http://localhost:8003/docs
- **OSCE**: http://localhost:8004/docs
- **Anatomy3D**: http://localhost:8005/docs
- **Grading**: http://localhost:8006/docs
- **Audit**: http://localhost:8007/docs
- **ML Hub**: http://localhost:8008/docs

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Follow conventional commits format
3. Add tests for new features
4. Update documentation
5. Submit PR with module label (e.g., `module:qbank`)

### Branch Naming

- `feature/module-name-description`
- `fix/module-name-bug-description`
- `docs/description`
- `refactor/description`

### PR Labels

- `module:preclinical` - Preclinical education features
- `module:clinical` - Clinical clerkships & OSCEs
- `module:skills-lab` - Skills lab simulators
- `module:qbank` - Question bank
- `module:agents` - AI teaching agents
- `module:mlhub` - ML model hub
- `module:studio` - Content studio
- `module:compliance` - Compliance & audit
- `module:eureka-integration` - EUREKA integration
- `dx:devops` - DevOps & infrastructure
- `dx:observability` - Monitoring & logging

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and decisions
- [Security](./docs/SECURITY.md) - Security practices and compliance
- [Data Governance](./docs/DATA-GOVERNANCE.md) - Data handling policies
- [Runbook](./docs/RUNBOOK.md) - Operations and troubleshooting
- [Contributing](./docs/CONTRIBUTING.md) - Contribution guidelines

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- EUREKA Platform for base infrastructure
- NBME for clinical vignette patterns
- USMLE for assessment standards
- shadcn/ui for component library
- FastAPI for Python service framework

---

**Built with ❤️ for medical education by the MedAtlas team**
