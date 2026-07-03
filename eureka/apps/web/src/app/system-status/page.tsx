'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
  Server,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface Service {
  name: string;
  url: string; // host-facing URL (for the open-in-tab link)
  port: number;
  description: string;
  status: 'online' | 'offline' | 'checking';
  category: 'core' | 'service';
}

// The real, current architecture: api-core + web, plus the 5 backend services
// the FE calls. (The old list referenced long-orphaned tier/ai/data services on
// dead ports and always showed the platform "down".) Health is probed
// server-side by /api/system-status using in-network hostnames; this list is
// name-matched to those results, and the URLs/ports here are host-facing.
const services: Service[] = [
  {
    name: 'API Core',
    url: 'http://localhost:8000',
    port: 8000,
    description: 'Main API + auth + all dashboard domains (FastAPI)',
    status: 'checking',
    category: 'core',
  },
  {
    name: 'Web Portal',
    url: 'http://localhost:4040',
    port: 4040,
    description: 'Next.js frontend application',
    status: 'checking',
    category: 'core',
  },
  {
    name: 'Test Prep',
    url: 'http://localhost:8200',
    port: 8200,
    description: 'QBank, mock exams, exam analytics (FastAPI)',
    status: 'checking',
    category: 'service',
  },
  {
    name: 'Notebook',
    url: 'http://localhost:8120',
    port: 8120,
    description: 'Projects, tasks, files (Node/Express)',
    status: 'checking',
    category: 'service',
  },
  {
    name: 'Medical School',
    url: 'http://localhost:8030',
    port: 8030,
    description: 'Clinical cases, USMLE, OSCE (NestJS)',
    status: 'checking',
    category: 'service',
  },
  {
    name: 'File Storage',
    url: 'http://localhost:8300',
    port: 8300,
    description: 'Uploads/downloads backed by MinIO (FastAPI)',
    status: 'checking',
    category: 'service',
  },
  {
    name: 'Analytics',
    url: 'http://localhost:8005',
    port: 8005,
    description: 'Learning analytics + event ingestion (FastAPI)',
    status: 'checking',
    category: 'service',
  },
];

export default function SystemStatusPage() {
  const [serviceStatuses, setServiceStatuses] = useState<Service[]>(services);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAllServices();
    const interval = setInterval(checkAllServices, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  const checkAllServices = async () => {
    try {
      const response = await fetch('/api/system-status');
      const data = await response.json();
      setServiceStatuses(
        services.map((service) => {
          const result = data.services.find((s: { name: string }) => s.name === service.name);
          return { ...service, status: result?.status || 'offline' } as Service;
        }),
      );
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to check service status:', error);
      setServiceStatuses(services.map((s) => ({ ...s, status: 'offline' as const })));
    }
  };

  const getStatusColor = (status: string) =>
    status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500';

  const getStatusIcon = (status: string) =>
    status === 'online' ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : status === 'offline' ? (
      <XCircle className="h-5 w-5 text-red-500" />
    ) : (
      <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
    );

  const onlineCount = serviceStatuses.filter((s) => s.status === 'online').length;
  const offlineCount = serviceStatuses.filter((s) => s.status === 'offline').length;

  const byCategory = {
    core: serviceStatuses.filter((s) => s.category === 'core'),
    service: serviceStatuses.filter((s) => s.category === 'service'),
  };

  const renderRow = (service: Service) => (
    <div
      key={service.name}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{service.name}</h4>
          <p className="text-sm text-gray-500">{service.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {service.url} • Port {service.port}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {getStatusIcon(service.status)}
        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-700"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-indigo-600">EUREKA</h1>
              <Badge variant="outline" className="text-sm">
                System Status
              </Badge>
            </div>
            <div className="flex gap-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{serviceStatuses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{onlineCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Offline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{offlineCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Last Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {mounted ? lastCheck.toLocaleTimeString() : '--:--:--'}
              </div>
              <Button variant="ghost" size="sm" onClick={checkAllServices} className="mt-2 w-full">
                Refresh Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Core */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Core
            </CardTitle>
            <CardDescription>API gateway + web frontend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">{byCategory.core.map(renderRow)}</div>
          </CardContent>
        </Card>

        {/* Backend services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backend Services
            </CardTitle>
            <CardDescription>The specialized services the dashboard calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">{byCategory.service.map(renderRow)}</div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">About this page</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <p className="mb-2">
              Status is probed every 30s server-side (via{' '}
              <code className="font-mono text-xs">/api/system-status</code>) using in-network
              hostnames, so there are no CORS issues. All 7 should read{' '}
              <strong>online</strong> when the stack is up
              (<code className="font-mono text-xs">docker compose up -d</code>).
            </p>
            <p>
              Most dashboard domains (tutor, research, pedagogy, XR, community, ethics, etc.) are
              served by <strong>API Core</strong> — the earlier standalone tier/AI/data
              microservices were consolidated into it.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
