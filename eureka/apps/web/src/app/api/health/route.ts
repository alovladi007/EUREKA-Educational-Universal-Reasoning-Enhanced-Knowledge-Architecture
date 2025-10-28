/**
 * Health check endpoint for the web portal
 * Returns 200 OK if the service is running
 */

export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'eureka-web-portal',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
