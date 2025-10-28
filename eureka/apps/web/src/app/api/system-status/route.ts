/**
 * Server-side system status check
 * Avoids CORS issues by checking services from the backend
 */

export const dynamic = 'force-dynamic';

const services = [
  // Core Services
  { name: 'API Core', url: 'http://localhost:8000', category: 'core' },
  { name: 'Web Portal', url: 'http://localhost:4500', category: 'core' },

  // Tier Services
  { name: 'High School Tier API', url: 'http://localhost:8001', category: 'tier' },
  { name: 'Undergraduate Tier API', url: 'http://localhost:8002', category: 'tier' },
  { name: 'Graduate Tier API', url: 'http://localhost:8003', category: 'tier' },
  { name: 'Medical School API', url: 'http://localhost:8004', category: 'tier' },
  { name: 'Law School API', url: 'http://localhost:8005', category: 'tier' },
  { name: 'MBA API', url: 'http://localhost:8006', category: 'tier' },
  { name: 'Engineering API', url: 'http://localhost:8007', category: 'tier' },

  // AI Services
  { name: 'AI Tutor (LLM)', url: 'http://localhost:8101', category: 'ai' },
  { name: 'Assessment Engine', url: 'http://localhost:8102', category: 'ai' },
  { name: 'Adaptive Learning', url: 'http://localhost:8103', category: 'ai' },

  // Data Services
  { name: 'Content Service', url: 'http://localhost:8201', category: 'data' },
  { name: 'Analytics Service', url: 'http://localhost:8202', category: 'data' },
  { name: 'Ingestion Service', url: 'http://localhost:8203', category: 'data' },
];

async function checkService(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${url}/health`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function GET() {
  const results = await Promise.all(
    services.map(async (service) => ({
      ...service,
      status: await checkService(service.url) ? 'online' : 'offline',
    }))
  );

  return Response.json({
    timestamp: new Date().toISOString(),
    services: results,
  });
}
