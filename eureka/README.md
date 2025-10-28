# EUREKA

**Educational Universal Reasoning & Enhanced Knowledge Architecture**

A production-grade, privacy-preserving, multi-tier AI education platform spanning High School through Professional Schools.

## 🎯 Vision

EUREKA is a comprehensive AI-powered learning ecosystem that adapts to learners across seven educational levels:

### Academic Tiers
- **High School** - CCSS/NGSS/AP aligned, gamified mastery learning
- **Undergraduate** - ABET/ACM/IEEE standards, lab-based learning, LTI integration
- **Graduate** - Research advisor, thesis tools, IRB-compliant workflows

### Professional Schools
- **Medical** - Clinical reasoning, OSCE simulation, board prep (USMLE)
- **Law** - Case analysis, moot court, Bluebook citations (NCBE)
- **MBA** - Case method, finance models, strategy simulations
- **Engineering** - FE/PE exam prep, circuit/control/thermal labs

## 🏗️ Architecture

### 11 Core Modules

**Core Services:**
1. `api-core` - Users, organizations, courses, content, grades
2. `tutor-llm` - Multimodal AI tutor with RAG and Socratic methods
3. `assess` - Assessments, autograding, rubrics, proctoring
4. `adaptive` - Knowledge tracing, mastery modeling, adaptive pathways

**Academic Tiers:**
5. `tier-hs` - High school learning engine
6. `tier-ug` - Undergraduate learning engine
7. `tier-grad` - Graduate research tools

**Professional Tiers:**
8. `pro-med` - Medical education suite
9. `pro-law` - Legal education suite
10. `pro-mba` - Business education suite
11. `pro-eng` - Engineering education suite

### Tech Stack

**Frontend:**
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- shadcn/ui components, WCAG 2.2 AA accessibility
- next-intl for i18n (EN/ES baseline)

**Mobile:**
- React Native (Expo) for learner app

**Backend:**
- FastAPI (Python 3.11), Pydantic v2
- Celery + Redis for async jobs
- LiteLLM for model orchestration

**Data:**
- PostgreSQL 16 with pgvector, Timescale
- MinIO/S3 for object storage
- OpenSearch/Elasticsearch for search

**Infrastructure:**
- Docker + docker-compose (dev)
- Kubernetes (Helm) + Terraform (prod)
- ArgoCD for GitOps

**Auth & Security:**
- Ory Kratos/Hydra or Auth0
- RBAC/ABAC with org-scoped tenancy
- FERPA/HIPAA/COPPA/ABA compliance

## 📁 Monorepo Structure

```
eureka/
├── apps/
│   ├── web/              # Next.js learner + educator portal
│   ├── mobile/           # Expo learner app
│   └── admin/            # Institution & meta dashboard
├── services/
│   ├── api-core/         # Core API (users, courses, content)
│   ├── tutor-llm/        # AI tutor with RAG
│   ├── assess/           # Assessments & rubrics
│   ├── adaptive/         # Mastery & knowledge tracing
│   ├── content/          # Authoring & curriculum generation
│   ├── ingestion/        # LTI/SCORM/xAPI/QTI importers
│   ├── analytics/        # ETL, risk flags, cohort analysis
│   ├── tier-hs/          # High school tier service
│   ├── tier-ug/          # Undergraduate tier service
│   ├── tier-grad/        # Graduate tier service
│   ├── pro-med/          # Medical school service
│   ├── pro-law/          # Law school service
│   ├── pro-mba/          # MBA service
│   └── pro-eng/          # Engineering service
├── libs/
│   ├── ui/               # Shared React components
│   ├── schema/           # OpenAPI, JSON schemas
│   └── utils/            # Shared utilities (TS/Python)
├── ops/
│   ├── helm/             # Kubernetes charts
│   ├── terraform/        # Infrastructure as code
│   └── ci/               # CI/CD configurations
├── datasets/
│   └── samples/          # Seed data for dev/demo
├── curricula/
│   ├── hs/               # High school standards & content
│   ├── ug/               # Undergraduate content
│   └── grad/             # Graduate research templates
└── docs/                 # Architecture & API docs
```

## 🚀 Quick Start

### Prerequisites
- Docker & docker-compose
- Node.js 20+
- Python 3.11+
- Git

### Development Setup

```bash
# Clone and enter
git clone <repo-url>
cd eureka

# Start all services
make dev

# Seed sample data
make seed

# Run tests
make test

# Run end-to-end tests
make e2e
```

## 🧪 Testing Strategy

- **Unit Tests:** >80% coverage per service (pytest, vitest)
- **Integration Tests:** API contract validation (OpenAPI)
- **E2E Tests:** Playwright flows for key user journeys
- **Accessibility:** axe-core automated checks
- **Security:** OWASP ZAP scans, secrets detection

## 🔒 Security & Compliance

- **FERPA** - Student data protection (all tiers)
- **HIPAA** - Protected health information (medical tier)
- **COPPA** - Children's privacy (high school tier)
- **ABA** - Client confidentiality (law tier)
- **SOC 2** - Security controls baseline
- **GDPR/CPRA** - Privacy rights & data retention

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design & data flow
- [Development](./docs/DEVELOPMENT.md) - Setup & contribution guide
- [API Reference](./docs/API.md) - OpenAPI documentation
- [Security](./SECURITY.md) - Vulnerability reporting
- [Compliance](./COMPLIANCE.md) - Regulatory controls

## 🗺️ Roadmap

### Phase 1: Core Platform (Weeks 1-4)
- ✅ Monorepo scaffold
- ⏳ Auth, multitenancy, RBAC
- ⏳ Course & content models
- ⏳ Base tutor LLM

### Phase 2: Academic Tiers (Weeks 5-8)
- ⏳ High school tier
- ⏳ Undergraduate tier
- ⏳ Graduate tier

### Phase 3: Professional Tiers (Weeks 9-12)
- ⏳ Medical school module
- ⏳ Law school module
- ⏳ MBA module
- ⏳ Engineering module

### Phase 4: Production Hardening (Weeks 13-16)
- ⏳ Performance optimization
- ⏳ Observability & monitoring
- ⏳ DR & backup procedures
- ⏳ Launch playbook

## 📄 License

[To be determined - consider Apache 2.0 or AGPL for education]

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow and PR guidelines.

## 📧 Contact

- **Documentation:** https://docs.eureka.edu (placeholder)
- **Security:** security@eureka.edu (placeholder)
- **Support:** support@eureka.edu (placeholder)

---

Built with ❤️ for educators and learners worldwide.
