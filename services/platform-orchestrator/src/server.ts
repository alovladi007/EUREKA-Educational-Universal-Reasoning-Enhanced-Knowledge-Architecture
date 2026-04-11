/**
 * EUREKA Platform Orchestrator
 * Main API Gateway and Service Coordinator
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import { serviceRegistry, HealthCheckResult } from './services/serviceRegistry';
import { createServiceProxy, checkServiceAvailability, proxyRoutes, ProxyRoute } from './middleware/serviceProxy';

dotenv.config();

// ===========================================
// CONFIGURATION
// ===========================================

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ===========================================
// MIDDLEWARE
// ===========================================

// Security
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development
  crossOriginEmbedderPolicy: false,
}));

// CORS
const corsOptions = {
  origin: NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS || '').split(',')
    : '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ===========================================
// SERVICE REGISTRATION
// ===========================================

console.log('[Platform Orchestrator] Registering services...');

serviceRegistry.registerMultiple([
  // Core Services
  {
    name: 'auth-service',
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    healthEndpoint: `${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/health`,
  },
  {
    name: 'test-prep-service',
    url: process.env.TEST_PREP_SERVICE_URL || 'http://localhost:3002',
    healthEndpoint: `${process.env.TEST_PREP_SERVICE_URL || 'http://localhost:3002'}/health`,
  },
  {
    name: 'ai-tutor-service',
    url: process.env.AI_TUTOR_SERVICE_URL || 'http://localhost:3003',
    healthEndpoint: `${process.env.AI_TUTOR_SERVICE_URL || 'http://localhost:3003'}/health`,
  },
  {
    name: 'xr-labs-service',
    url: process.env.XR_LABS_SERVICE_URL || 'http://localhost:3005',
    healthEndpoint: `${process.env.XR_LABS_SERVICE_URL || 'http://localhost:3005'}/health`,
  },
  {
    name: 'notebook-service',
    url: process.env.NOTEBOOK_SERVICE_URL || 'http://localhost:3006',
    healthEndpoint: `${process.env.NOTEBOOK_SERVICE_URL || 'http://localhost:3006'}/health`,
  },

  // Educational Tier Services
  {
    name: 'high-school-service',
    url: process.env.HIGH_SCHOOL_SERVICE_URL || 'http://localhost:8010',
    healthEndpoint: `${process.env.HIGH_SCHOOL_SERVICE_URL || 'http://localhost:8010'}/health`,
  },
  {
    name: 'undergraduate-service',
    url: process.env.UNDERGRADUATE_SERVICE_URL || 'http://localhost:8011',
    healthEndpoint: `${process.env.UNDERGRADUATE_SERVICE_URL || 'http://localhost:8011'}/health`,
  },
  {
    name: 'graduate-service',
    url: process.env.GRADUATE_SERVICE_URL || 'http://localhost:8012',
    healthEndpoint: `${process.env.GRADUATE_SERVICE_URL || 'http://localhost:8012'}/health`,
  },

  // Professional Services
  {
    name: 'medical-school-service',
    url: process.env.MEDICAL_SCHOOL_SERVICE_URL || 'http://localhost:8020',
    healthEndpoint: `${process.env.MEDICAL_SCHOOL_SERVICE_URL || 'http://localhost:8020'}/health`,
  },
  {
    name: 'law-school-service',
    url: process.env.LAW_SCHOOL_SERVICE_URL || 'http://localhost:8021',
    healthEndpoint: `${process.env.LAW_SCHOOL_SERVICE_URL || 'http://localhost:8021'}/health`,
  },
  {
    name: 'mba-service',
    url: process.env.MBA_SERVICE_URL || 'http://localhost:8022',
    healthEndpoint: `${process.env.MBA_SERVICE_URL || 'http://localhost:8022'}/health`,
  },
  {
    name: 'engineering-service',
    url: process.env.ENGINEERING_SERVICE_URL || 'http://localhost:8023',
    healthEndpoint: `${process.env.ENGINEERING_SERVICE_URL || 'http://localhost:8023'}/health`,
  },

  // Platform Services
  {
    name: 'data-fabric-service',
    url: process.env.DATA_FABRIC_SERVICE_URL || 'http://localhost:3010',
    healthEndpoint: `${process.env.DATA_FABRIC_SERVICE_URL || 'http://localhost:3010'}/health`,
  },
  {
    name: 'marketplace-service',
    url: process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:3011',
    healthEndpoint: `${process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:3011'}/health`,
  },
  {
    name: 'analytics-service',
    url: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3012',
    healthEndpoint: `${process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3012'}/health`,
  },
]);

// Start health monitoring
serviceRegistry.startHealthChecks();

// Listen for service health changes
serviceRegistry.on('healthCheck', (results: HealthCheckResult[]) => {
  const downServices = results.filter((r: HealthCheckResult) => r.status === 'down');
  if (downServices.length > 0) {
    console.warn(`[Platform Orchestrator] ${downServices.length} service(s) down:`,
      downServices.map((s: HealthCheckResult) => s.service).join(', '));
  }
});

// ===========================================
// HEALTH ENDPOINTS
// ===========================================

/**
 * Orchestrator health check
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Platform Orchestrator',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Detailed health with all service statuses
 */
app.get('/health/detailed', async (req: Request, res: Response) => {
  const summary = serviceRegistry.getHealthSummary();

  res.json({
    orchestrator: {
      status: 'healthy',
      version: '1.0.0',
      uptime: process.uptime(),
    },
    platform: summary,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Individual service health
 */
app.get('/health/services/:serviceName', async (req: Request, res: Response) => {
  const { serviceName } = req.params;
  const result = await serviceRegistry.checkServiceHealth(serviceName);

  if (result.status === 'down') {
    return res.status(503).json(result);
  }

  res.json(result);
});

// ===========================================
// API INFORMATION ENDPOINT
// ===========================================

app.get('/api', (req: Request, res: Response) => {
  const services = serviceRegistry.getAllServices();

  res.json({
    name: 'EUREKA Platform Orchestrator',
    version: '1.0.0',
    description: 'Unified API Gateway for EUREKA Educational Platform',
    documentation: '/api/docs',
    services: {
      total: services.length,
      healthy: services.filter(s => s.status === 'healthy').length,
      available: services
        .filter(s => s.status === 'healthy')
        .map(s => ({
          name: s.name,
          status: s.status,
          lastCheck: s.lastCheck,
        })),
    },
    routes: proxyRoutes.map(r => ({
      path: r.path,
      service: r.serviceName,
    })),
  });
});

// ===========================================
// SERVICE PROXY ROUTES
// ===========================================

// Register all proxy routes
proxyRoutes.forEach(route => {
  const pathRewrite = route.rewritePath
    ? { [`^${route.path}`]: route.rewritePath(route.path) }
    : undefined;

  app.use(
    route.path,
    checkServiceAvailability(route.serviceName),
    createServiceProxy(route.serviceName, pathRewrite)
  );

  console.log(`[Platform Orchestrator] Registered route: ${route.path} → ${route.serviceName}`);
});

// ===========================================
// AGGREGATION ENDPOINTS
// ===========================================

/**
 * Unified dashboard - aggregate data from multiple services
 */
app.get('/api/dashboard', async (req: Request, res: Response) => {
  try {
    const xrService = serviceRegistry.getService('xr-labs-service');
    const testPrepService = serviceRegistry.getService('test-prep-service');

    const dashboard: any = {
      platform: serviceRegistry.getHealthSummary(),
      modules: {},
    };

    // Only fetch from healthy services
    if (xrService?.status === 'healthy') {
      dashboard.modules.xrLabs = {
        available: true,
        url: `${xrService.url}/api/xr/dashboard/stats`,
      };
    }

    if (testPrepService?.status === 'healthy') {
      dashboard.modules.testPrep = {
        available: true,
        url: `${testPrepService.url}/api/stats`,
      };
    }

    res.json(dashboard);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: error.message,
    });
  }
});

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    suggestion: 'Check /api for available routes',
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Platform Orchestrator] Error:', err);

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ===========================================
// START SERVER
// ===========================================

const server = app.listen(PORT, () => {
  console.log('');
  console.log('================================================');
  console.log('🚀 EUREKA Platform Orchestrator');
  console.log('================================================');
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`API Documentation: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log('================================================');
  console.log('');
  console.log(`Registered ${serviceRegistry.getAllServices().length} services`);
  console.log('Health monitoring active');
  console.log('');
});

// Graceful Shutdown
const shutdown = () => {
  console.log('\n[Platform Orchestrator] Shutting down gracefully...');

  serviceRegistry.stopHealthChecks();

  server.close(() => {
    console.log('[Platform Orchestrator] Server closed');
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('[Platform Orchestrator] Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
