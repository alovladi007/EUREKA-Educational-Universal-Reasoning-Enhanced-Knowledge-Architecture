'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import {
  Server,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Cpu,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface Service {
  name: string;
  url: string;
  port: number;
  description: string;
  status: 'online' | 'offline' | 'checking';
  category: 'core' | 'tier' | 'ai' | 'data';
}

const services: Service[] = [
  // Core Services
  {
    name: 'API Core',
    url: 'http://localhost:8000',
    port: 8000,
    description: 'Main API Gateway & Authentication',
    status: 'checking',
    category: 'core',
  },
  {
    name: 'Web Portal',
    url: 'http://localhost:4500',
    port: 4500,
    description: 'Next.js Frontend Application',
    status: 'checking',
    category: 'core',
  },

  // Tier Services
  {
    name: 'High School Tier API',
    url: 'http://localhost:8001',
    port: 8001,
    description: 'HS-specific features: Badges, Game Points, Leaderboards',
    status: 'checking',
    category: 'tier',
  },
  {
    name: 'Undergraduate Tier API',
    url: 'http://localhost:8010',
    port: 8010,
    description: 'UG-specific features: Labs, Projects, Peer Review',
    status: 'checking',
    category: 'tier',
  },
  {
    name: 'Graduate Tier API',
    url: 'http://localhost:8011',
    port: 8011,
    description: 'Grad-specific features: Research, Thesis, Publications',
    status: 'checking',
    category: 'tier',
  },
  {
    name: 'Medical School API',
    url: 'http://localhost:8012',
    port: 8012,
    description: 'Medical education: Clinical cases, USMLE prep',
    status: 'checking',
    category: 'tier',
  },
  {
    name: 'Law School API',
    url: 'http://localhost:8013',
    port: 8013,
    description: 'Legal education: Case analysis, Bar exam prep',
    status: 'checking',
    category: 'tier',
  },
  {
    name: 'MBA API',
    url: 'http://localhost:8014',
    port: 8014,
    description: 'Business education: Case studies, Simulations',
    status: 'checking',
    category: 'tier',
  },
  {
    name: 'Engineering API',
    url: 'http://localhost:8015',
    port: 8015,
    description: 'Engineering education: FE/PE exam prep',
    status: 'checking',
    category: 'tier',
  },

  // AI Services (Session 6)
  {
    name: 'AI Tutor (LLM)',
    url: 'http://localhost:8050',
    port: 8050,
    description: 'AI tutoring with RAG, Socratic method (Session 6 Part I)',
    status: 'checking',
    category: 'ai',
  },
  {
    name: 'Assessment Engine',
    url: 'http://localhost:8051',
    port: 8051,
    description: 'Auto-grading, AI essay grading, rubrics (Session 6 Part I)',
    status: 'checking',
    category: 'ai',
  },
  {
    name: 'Adaptive Learning',
    url: 'http://localhost:8052',
    port: 8052,
    description: 'Knowledge graphs, personalized learning paths (Session 6 Part II)',
    status: 'checking',
    category: 'ai',
  },
  {
    name: 'Analytics Dashboard',
    url: 'http://localhost:8053',
    port: 8053,
    description: 'Student analytics, at-risk identification (Session 6 Part II)',
    status: 'checking',
    category: 'ai',
  },

  // Data Services
  {
    name: 'Content Service',
    url: 'http://localhost:8201',
    port: 8201,
    description: 'Course content management',
    status: 'checking',
    category: 'data',
  },
  {
    name: 'Analytics Service',
    url: 'http://localhost:8202',
    port: 8202,
    description: 'Learning analytics & insights',
    status: 'checking',
    category: 'data',
  },
  {
    name: 'Ingestion Service',
    url: 'http://localhost:8203',
    port: 8203,
    description: 'External content ingestion',
    status: 'checking',
    category: 'data',
  },
];

export default function SystemStatusPage() {
  const [serviceStatuses, setServiceStatuses] = useState<Service[]>(services);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAllServices();
    const interval = setInterval(() => {
      checkAllServices();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkAllServices = async () => {
    try {
      // Use server-side API to avoid CORS issues
      const response = await fetch('/api/system-status');
      const data = await response.json();

      // Merge the status results with our service definitions
      const updatedServices = services.map((service) => {
        const statusResult = data.services.find((s: any) => s.name === service.name);
        return {
          ...service,
          status: statusResult?.status || 'offline',
        } as Service;
      });

      setServiceStatuses(updatedServices);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to check service status:', error);
      // Mark all as offline if check fails
      setServiceStatuses(services.map(s => ({ ...s, status: 'offline' as const })));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core':
        return <Server className="h-5 w-5" />;
      case 'tier':
        return <Database className="h-5 w-5" />;
      case 'ai':
        return <Cpu className="h-5 w-5" />;
      case 'data':
        return <Database className="h-5 w-5" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  const onlineCount = serviceStatuses.filter((s) => s.status === 'online').length;
  const offlineCount = serviceStatuses.filter((s) => s.status === 'offline').length;

  const servicesByCategory = {
    core: serviceStatuses.filter((s) => s.category === 'core'),
    tier: serviceStatuses.filter((s) => s.category === 'tier'),
    ai: serviceStatuses.filter((s) => s.category === 'ai'),
    data: serviceStatuses.filter((s) => s.category === 'data'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{serviceStatuses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{onlineCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Offline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{offlineCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Last Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {mounted ? lastCheck.toLocaleTimeString() : '--:--:--'}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={checkAllServices}
                className="mt-2 w-full"
              >
                Refresh Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Core Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Core Services
            </CardTitle>
            <CardDescription>Essential platform infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {servicesByCategory.core.map((service) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Educational Tier Services
            </CardTitle>
            <CardDescription>Tier-specific APIs for each educational level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {servicesByCategory.tier.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Port {service.port}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <a
                      href={`${service.url}/docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              AI & ML Services
            </CardTitle>
            <CardDescription>Intelligent tutoring and adaptive learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {servicesByCategory.ai.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Port {service.port}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <a
                      href={`${service.url}/docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Services
            </CardTitle>
            <CardDescription>Content management and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {servicesByCategory.data.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Port {service.port}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <a
                      href={`${service.url}/docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <p className="mb-2">
              <strong>Note:</strong> Most services are not yet running. This is expected as EUREKA is being built incrementally across sessions.
            </p>
            <p className="mb-2">
              <strong>Currently Active (Session 5):</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Web Portal (Port 4500) - ✓ Running</li>
              <li>High School Tier API (Port 8001) - Backend ready, needs startup</li>
            </ul>
            <p className="mt-4">
              <strong>Coming in Future Sessions:</strong> AI Tutor, Assessment Engine, Adaptive Learning, and other tier-specific APIs.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
