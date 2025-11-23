/**
 * Service Proxy Middleware - Routes requests to appropriate microservices
 */

import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { serviceRegistry } from '../services/serviceRegistry';

export interface ProxyRoute {
  path: string;
  serviceName: string;
  rewritePath?: (path: string) => string;
}

/**
 * Create proxy middleware for a specific service
 */
export function createServiceProxy(serviceName: string, pathRewrite?: Record<string, string>) {
  return createProxyMiddleware({
    target: '', // Will be set dynamically
    changeOrigin: true,
    pathRewrite,

    // Dynamically set target based on service status
    router: (req) => {
      const service = serviceRegistry.getService(serviceName);
      if (!service) {
        throw new Error(`Service ${serviceName} not found in registry`);
      }

      if (service.status === 'down') {
        throw new Error(`Service ${serviceName} is currently unavailable`);
      }

      return service.url;
    },

    // Error handling
    onError: (err, req, res) => {
      console.error(`[Proxy] Error forwarding to ${serviceName}:`, err.message);
      (res as Response).status(502).json({
        error: 'Bad Gateway',
        message: `Unable to reach ${serviceName} service`,
        service: serviceName,
      });
    },

    // Request handling
    onProxyReq: (proxyReq, req) => {
      // Fix request body for POST/PUT/PATCH
      fixRequestBody(proxyReq, req);
      // Logging
      console.log(`[Proxy] ${req.method} ${req.path} → ${serviceName}`);
    },

    // Response logging
    onProxyRes: (proxyRes, req) => {
      console.log(`[Proxy] ${serviceName} → ${proxyRes.statusCode} (${req.method} ${req.path})`);
    },
  });
}

/**
 * Service availability check middleware
 */
export function checkServiceAvailability(serviceName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const service = serviceRegistry.getService(serviceName);

    if (!service) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: `Service ${serviceName} is not registered`,
        serviceName,
      });
    }

    if (service.status === 'down') {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: `Service ${serviceName} is currently down`,
        serviceName,
        lastCheck: service.lastCheck,
      });
    }

    if (service.status === 'degraded') {
      // Log warning but allow request through
      console.warn(`[ServiceProxy] Warning: ${serviceName} is in degraded state`);
    }

    next();
  };
}

/**
 * Route requests based on path prefix
 */
export const proxyRoutes: ProxyRoute[] = [
  // Authentication & User Management
  {
    path: '/api/auth',
    serviceName: 'auth-service',
  },

  // Test Preparation Platform
  {
    path: '/api/test-prep',
    serviceName: 'test-prep-service',
    rewritePath: (path) => path.replace('/api/test-prep', '/api'),
  },

  // AI Tutor
  {
    path: '/api/ai-tutor',
    serviceName: 'ai-tutor-service',
    rewritePath: (path) => path.replace('/api/ai-tutor', '/api'),
  },

  // XR Learning Labs
  {
    path: '/api/xr',
    serviceName: 'xr-labs-service',
    rewritePath: (path) => path.replace('/api/xr', '/api/xr'),
  },

  // Digital Notebook
  {
    path: '/api/notebook',
    serviceName: 'notebook-service',
    rewritePath: (path) => path.replace('/api/notebook', '/api'),
  },

  // Educational Tiers
  {
    path: '/api/high-school',
    serviceName: 'high-school-service',
  },
  {
    path: '/api/undergraduate',
    serviceName: 'undergraduate-service',
  },
  {
    path: '/api/graduate',
    serviceName: 'graduate-service',
  },

  // Professional Programs
  {
    path: '/api/medical',
    serviceName: 'medical-school-service',
  },
  {
    path: '/api/law',
    serviceName: 'law-school-service',
  },
  {
    path: '/api/mba',
    serviceName: 'mba-service',
  },
  {
    path: '/api/engineering',
    serviceName: 'engineering-service',
  },

  // Platform Services
  {
    path: '/api/data',
    serviceName: 'data-fabric-service',
  },
  {
    path: '/api/marketplace',
    serviceName: 'marketplace-service',
  },
  {
    path: '/api/analytics',
    serviceName: 'analytics-service',
  },
];
