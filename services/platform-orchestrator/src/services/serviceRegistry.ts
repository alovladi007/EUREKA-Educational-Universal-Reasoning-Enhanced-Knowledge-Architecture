/**
 * Service Registry - Tracks all microservices and their health status
 */

import axios, { AxiosError } from 'axios';
import EventEmitter from 'events';

export interface Service {
  name: string;
  url: string;
  healthEndpoint: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  lastCheck: Date;
  responseTime?: number;
  version?: string;
  metadata?: Record<string, any>;
}

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  error?: string;
  details?: any;
}

export class ServiceRegistry extends EventEmitter {
  private services: Map<string, Service>;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private readonly checkIntervalMs: number;
  private readonly timeoutMs: number;

  constructor(checkIntervalMs = 30000, timeoutMs = 5000) {
    super();
    this.services = new Map();
    this.checkIntervalMs = checkIntervalMs;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Register a new service
   */
  register(service: Omit<Service, 'status' | 'lastCheck'>): void {
    this.services.set(service.name, {
      ...service,
      status: 'unknown',
      lastCheck: new Date(),
    });
    console.log(`[ServiceRegistry] Registered service: ${service.name} at ${service.url}`);
  }

  /**
   * Register multiple services
   */
  registerMultiple(services: Array<Omit<Service, 'status' | 'lastCheck'>>): void {
    services.forEach(service => this.register(service));
  }

  /**
   * Get service by name
   */
  getService(name: string): Service | undefined {
    return this.services.get(name);
  }

  /**
   * Get all services
   */
  getAllServices(): Service[] {
    return Array.from(this.services.values());
  }

  /**
   * Get healthy services only
   */
  getHealthyServices(): Service[] {
    return this.getAllServices().filter(s => s.status === 'healthy');
  }

  /**
   * Check health of a specific service
   */
  async checkServiceHealth(serviceName: string): Promise<HealthCheckResult> {
    const service = this.services.get(serviceName);
    if (!service) {
      return {
        service: serviceName,
        status: 'down',
        responseTime: 0,
        error: 'Service not registered',
      };
    }

    const startTime = Date.now();

    try {
      const response = await axios.get(service.healthEndpoint, {
        timeout: this.timeoutMs,
        validateStatus: (status) => status < 500,
      });

      const responseTime = Date.now() - startTime;

      let status: 'healthy' | 'degraded' | 'down' = 'healthy';
      if (response.status >= 500) {
        status = 'down';
      } else if (response.status >= 400 || responseTime > 2000) {
        status = 'degraded';
      }

      // Update service status
      this.services.set(serviceName, {
        ...service,
        status,
        lastCheck: new Date(),
        responseTime,
        version: response.data?.version,
        metadata: response.data,
      });

      return {
        service: serviceName,
        status,
        responseTime,
        details: response.data,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const err = error as AxiosError;

      // Update service as down
      this.services.set(serviceName, {
        ...service,
        status: 'down',
        lastCheck: new Date(),
        responseTime,
      });

      return {
        service: serviceName,
        status: 'down',
        responseTime,
        error: err.code === 'ECONNREFUSED'
          ? 'Service unavailable'
          : err.message || 'Unknown error',
      };
    }
  }

  /**
   * Check health of all services
   */
  async checkAllServices(): Promise<HealthCheckResult[]> {
    const serviceNames = Array.from(this.services.keys());
    const checks = serviceNames.map(name => this.checkServiceHealth(name));
    return Promise.all(checks);
  }

  /**
   * Start periodic health checks
   */
  startHealthChecks(): void {
    if (this.healthCheckInterval) {
      console.log('[ServiceRegistry] Health checks already running');
      return;
    }

    console.log(`[ServiceRegistry] Starting health checks (interval: ${this.checkIntervalMs}ms)`);

    // Initial check
    this.checkAllServices().then(results => {
      this.emit('healthCheck', results);
    });

    // Periodic checks
    this.healthCheckInterval = setInterval(async () => {
      const results = await this.checkAllServices();
      this.emit('healthCheck', results);

      // Log any service status changes
      results.forEach(result => {
        const service = this.services.get(result.service);
        if (service) {
          if (result.status === 'down' && service.status !== 'down') {
            console.error(`[ServiceRegistry] Service ${result.service} is DOWN`);
          } else if (result.status === 'healthy' && service.status === 'down') {
            console.log(`[ServiceRegistry] Service ${result.service} is back ONLINE`);
          }
        }
      });
    }, this.checkIntervalMs);
  }

  /**
   * Stop health checks
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('[ServiceRegistry] Health checks stopped');
    }
  }

  /**
   * Get platform health summary
   */
  getHealthSummary() {
    const services = this.getAllServices();
    const total = services.length;
    const healthy = services.filter(s => s.status === 'healthy').length;
    const degraded = services.filter(s => s.status === 'degraded').length;
    const down = services.filter(s => s.status === 'down').length;
    const unknown = services.filter(s => s.status === 'unknown').length;

    return {
      total,
      healthy,
      degraded,
      down,
      unknown,
      healthPercentage: total > 0 ? Math.round((healthy / total) * 100) : 0,
      status: down > 0 ? 'degraded' : healthy === total ? 'healthy' : 'partial',
      services: services.map(s => ({
        name: s.name,
        status: s.status,
        responseTime: s.responseTime,
        lastCheck: s.lastCheck,
      })),
    };
  }
}

// Singleton instance
export const serviceRegistry = new ServiceRegistry(
  parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'),
  parseInt(process.env.SERVICE_TIMEOUT || '5000')
);
