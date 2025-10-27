# EUREKA - Educational Universal Reasoning & Enhanced Knowledge Architecture

A comprehensive educational platform spanning High School through Graduate education.

## 🏗️ Architecture

```
eureka/
├── services/
│   ├── core/           # Shared services (auth, content, analytics)
│   ├── tier-hs/        # High School tier (K-12)
│   ├── tier-ug/        # Undergraduate tier
│   └── tier-grad/      # Graduate tier
├── apps/
│   ├── web-hs/         # High School web app
│   ├── web-ug/         # Undergraduate web app
│   ├── web-grad/       # Graduate web app
│   └── admin/          # Admin dashboard
├── curricula/          # Standards mappings & content
├── gamify/            # Gamification rules
└── docker-compose.yml
```

## 🎯 Tiers

### 🎒 High School Tier
- **Standards**: CCSS, NGSS, AP
- **Features**: Mentor tutor, gamification, parent/teacher dashboards
- **Compliance**: COPPA, FERPA
- **Subjects**: Algebra I/II, Geometry, Biology, Chemistry, US History

### 🎓 Undergraduate Tier
- **Standards**: ABET, ACM, IEEE, OpenStax, MIT OCW
- **Features**: Socratic tutoring, labs, peer review, LMS integration
- **Compliance**: FERPA, LTI 1.3, QTI
- **Subjects**: Calculus, Physics, CS, Economics, Composition

### 📚 Graduate Tier
- **Features**: Research workspace, thesis coach, lit review tools
- **Compliance**: IRB, data governance
- **Tools**: Citation management, LaTeX export, peer review simulator

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start all tiers
docker-compose up

# Or start individual tier
docker-compose up tier-hs
docker-compose up tier-ug
docker-compose up tier-grad
```

## 📊 Endpoints

### High School
- `http://localhost:3001` - Student interface
- `http://localhost:8001/docs` - API docs

### Undergraduate
- `http://localhost:3002` - Course hub
- `http://localhost:8002/docs` - API docs

### Graduate
- `http://localhost:3003` - Research workspace
- `http://localhost:8003/docs` - API docs

### Admin
- `http://localhost:3000` - Cross-tier dashboard

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific tier
npm test -- tier-hs
npm test -- tier-ug
npm test -- tier-grad

# E2E demo
make e2e-demo
```

## 📝 Development

See individual tier READMEs:
- [High School Tier](./services/tier-hs/README.md)
- [Undergraduate Tier](./services/tier-ug/README.md)
- [Graduate Tier](./services/tier-grad/README.md)

## 📜 License

Educational Use License - See LICENSE file
