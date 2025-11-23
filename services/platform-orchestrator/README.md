# EUREKA Platform Orchestrator

**Unified API Gateway and Service Coordinator for the EUREKA Educational Platform**

The Platform Orchestrator serves as the central entry point for all EUREKA microservices, providing service discovery, health monitoring, request routing, and unified API access.

---

## 🎯 Overview

The Platform Orchestrator is a production-ready API gateway that:

- **Routes requests** to appropriate microservices
- **Monitors health** of all platform services
- **Aggregates data** from multiple services
- **Provides unified authentication** and authorization
- **Handles failover** and service degradation gracefully
- **Enforces rate limiting** and security policies
- **Logs and tracks** all API requests

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│          (Web, Mobile, Desktop, Third-party)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS/WSS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Platform Orchestrator (Port 3000)              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐    │
│  │   Service    │  │   Routing    │  │    Health     │    │
│  │  Discovery   │  │    & Proxy   │  │  Monitoring   │    │
│  └──────────────┘  └──────────────┘  └───────────────┘    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐    │
│  │     Rate     │  │    Cache     │  │     Auth      │    │
│  │   Limiting   │  │   Manager    │  │  Middleware   │    │
│  └──────────────┘  └──────────────┘  └───────────────┘    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Internal HTTP
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Microservices Layer                       │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   Auth   │ │   Test   │ │    AI    │ │    XR    │      │
│  │  Service │ │   Prep   │ │   Tutor  │ │   Labs   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Medical  │ │   Law    │ │    MBA   │ │   Data   │      │
│  │  School  │ │  School  │ │ Program  │ │  Fabric  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│              ... 15+ microservices total ...                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Features

### Service Discovery & Registration
- Automatic service registration at startup
- Dynamic service health monitoring
- Failover and load balancing support
- Service metadata tracking

### Health Monitoring
- Periodic health checks (configurable interval)
- Real-time service status tracking
- Degraded service detection
- Health summary aggregation

### Request Routing
- Path-based routing to services
- Service availability checking
- Automatic retry on failure
- Request/response logging

### Security
- Rate limiting per IP
- CORS configuration
- Helmet security headers
- Request validation

### Performance
- Response compression
- Caching layer (planned)
- Connection pooling
- Request timeout handling

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 16 (optional)
- Redis (optional, for caching)

### Installation

```bash
cd services/platform-orchestrator
npm install
```

### Configuration

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit `.env` and configure service URLs:

```env
PORT=3000
NODE_ENV=development

# Service URLs
XR_LABS_SERVICE_URL=http://localhost:3005
TEST_PREP_SERVICE_URL=http://localhost:3002
AI_TUTOR_SERVICE_URL=http://localhost:3003
# ... configure other services
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

---

## 📡 API Routes

### Platform Routes

| Route | Description |
|-------|-------------|
| `GET /health` | Orchestrator health check |
| `GET /health/detailed` | Detailed health with all services |
| `GET /health/services/:name` | Individual service health |
| `GET /api` | API information and service list |
| `GET /api/dashboard` | Unified platform dashboard |

### Proxied Service Routes

| Route Prefix | Target Service | Port |
|--------------|----------------|------|
| `/api/auth` | Auth Service | 3001 |
| `/api/test-prep` | Test Prep Platform | 3002 |
| `/api/ai-tutor` | AI Tutor Service | 3003 |
| `/api/xr` | XR Learning Labs | 3005 |
| `/api/notebook` | Digital Notebook | 3006 |
| `/api/high-school` | High School Tier | 8010 |
| `/api/undergraduate` | Undergraduate Tier | 8011 |
| `/api/graduate` | Graduate Tier | 8012 |
| `/api/medical` | Medical School | 8020 |
| `/api/law` | Law School | 8021 |
| `/api/mba` | MBA Program | 8022 |
| `/api/engineering` | Engineering Program | 8023 |
| `/api/data` | Data Fabric | 3010 |
| `/api/marketplace` | Content Marketplace | 3011 |
| `/api/analytics` | Analytics Service | 3012 |

---

## 🔧 Usage Examples

### Check Platform Health

```bash
curl http://localhost:3000/health/detailed
```

Response:
```json
{
  "orchestrator": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 12345
  },
  "platform": {
    "total": 15,
    "healthy": 13,
    "degraded": 1,
    "down": 1,
    "healthPercentage": 87,
    "services": [...]
  }
}
```

### Route Request to XR Labs

```bash
curl http://localhost:3000/api/xr/simulations
```

This automatically routes to `http://localhost:3005/api/xr/simulations`

### Get Unified Dashboard

```bash
curl http://localhost:3000/api/dashboard
```

Aggregates data from multiple services into a single response.

---

## 🏥 Health Monitoring

The orchestrator continuously monitors all registered services:

- **Health Check Interval**: 30 seconds (configurable)
- **Service Timeout**: 5 seconds
- **Status Levels**:
  - `healthy`: Service responding normally
  - `degraded`: Service slow or returning 4xx errors
  - `down`: Service unreachable or returning 5xx errors
  - `unknown`: Not yet checked

### Health Check Events

The service registry emits events that can be used for monitoring:

```typescript
serviceRegistry.on('healthCheck', (results) => {
  // Handle health check results
  console.log(results);
});
```

---

## 🔒 Security Features

### Rate Limiting

Default configuration:
- Window: 15 minutes
- Max requests: 100 per IP
- Applies to all `/api/*` routes

### CORS

Configurable allowed origins:
- Development: Allows all origins
- Production: Restricts to configured origins

### Helmet Security Headers

Automatically adds security headers:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (in production)

---

## 📊 Monitoring & Observability

### Logging

All requests are logged with:
- Timestamp
- HTTP method
- Path
- Status code
- Response time

Example log:
```
[2025-01-23T04:00:00.000Z] GET /api/xr/simulations 200 45ms
```

### Service Status Logging

```
[ServiceRegistry] Service xr-labs-service is DOWN
[ServiceRegistry] Service xr-labs-service is back ONLINE
```

### Health Summary

```bash
curl http://localhost:3000/health/detailed | jq '.platform'
```

---

## 🛠️ Development

### Project Structure

```
services/platform-orchestrator/
├── src/
│   ├── server.ts                  # Main server
│   ├── services/
│   │   └── serviceRegistry.ts     # Service discovery & health
│   ├── middleware/
│   │   └── serviceProxy.ts        # Request routing
│   ├── routes/                    # API routes
│   └── utils/                     # Utilities
├── dist/                          # Compiled output
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Adding a New Service

1. Add service URL to `.env`:
   ```env
   NEW_SERVICE_URL=http://localhost:8024
   ```

2. Register in `server.ts`:
   ```typescript
   serviceRegistry.register({
     name: 'new-service',
     url: process.env.NEW_SERVICE_URL,
     healthEndpoint: `${process.env.NEW_SERVICE_URL}/health`,
   });
   ```

3. Add route in `serviceProxy.ts`:
   ```typescript
   {
     path: '/api/new-service',
     serviceName: 'new-service',
   }
   ```

---

## 🧪 Testing

Run health check tests:

```bash
# Check orchestrator health
curl http://localhost:3000/health

# Check all services
curl http://localhost:3000/health/detailed

# Check specific service
curl http://localhost:3000/health/services/xr-labs-service
```

---

## 📈 Performance

- **Response Time**: < 50ms for proxied requests
- **Health Checks**: Parallel execution
- **Connection Pooling**: Automatic
- **Compression**: Gzip enabled
- **Caching**: Planned (Redis integration)

---

## 🚦 Production Deployment

### Environment Variables

Required production variables:

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://app.eureka.edu,https://admin.eureka.edu

# Service URLs (production)
XR_LABS_SERVICE_URL=https://xr-api.eureka.edu
# ... other services
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
CMD ["node", "dist/server.js"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: platform-orchestrator
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: orchestrator
        image: eureka/platform-orchestrator:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

---

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update documentation
4. Maintain backward compatibility

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🔗 Related Documentation

- [EUREKA Platform README](../../README.md)
- [XR Labs Service](../xr-labs/README.md)
- [Test Prep Service](../test-prep/README.md)
- [AI Tutor Service](../ai-tutor/README.md)

---

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@eureka.edu
- Documentation: https://docs.eureka.edu

---

**Built with ❤️ for EUREKA Educational Platform**
