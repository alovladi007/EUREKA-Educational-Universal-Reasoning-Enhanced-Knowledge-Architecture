/**
 * Server-side system status check.
 *
 * Runs inside the web container, so it probes services by their DOCKER-NETWORK
 * hostnames + INTERNAL ports (not the host-published ports) to avoid CORS and
 * host/loopback confusion. These are the 6 real backends the FE actually uses;
 * the old list referenced long-orphaned tier/ai/data services on dead ports.
 */

export const dynamic = 'force-dynamic';

type Svc = { name: string; url: string; healthPath: string; category: 'core' | 'service' };

const services: Svc[] = [
  // Core
  { name: 'API Core', url: 'http://api-core:8000', healthPath: '/health', category: 'core' },
  { name: 'Web Portal', url: 'http://localhost:3000', healthPath: '/', category: 'core' },

  // Backend services the FE calls
  { name: 'Test Prep', url: 'http://test-prep:8200', healthPath: '/health', category: 'service' },
  { name: 'Notebook', url: 'http://notebook:8120', healthPath: '/health', category: 'service' },
  { name: 'Medical School', url: 'http://medical-school:8030', healthPath: '/api/v1/health', category: 'service' },
  { name: 'File Storage', url: 'http://file-storage:8000', healthPath: '/health', category: 'service' },
  { name: 'Analytics', url: 'http://analytics:8000', healthPath: '/health', category: 'service' },
];

async function checkService(url: string, healthPath: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${url}${healthPath}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const results = await Promise.all(
    services.map(async (service) => ({
      name: service.name,
      url: service.url,
      category: service.category,
      status: (await checkService(service.url, service.healthPath)) ? 'online' : 'offline',
    })),
  );

  return Response.json({ timestamp: new Date().toISOString(), services: results });
}
