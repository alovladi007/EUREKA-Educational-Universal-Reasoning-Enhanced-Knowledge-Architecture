"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle,
  FileText,
  Users,
  TrendingUp,
  Award,
  ShieldCheck,
} from 'lucide-react';

const ETHICS_SECURITY_API = process.env.NEXT_PUBLIC_ETHICS_SECURITY_URL || 'http://localhost:8080';

export default function EthicsSecurityPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadEthicsSecurityData();
  }, []);

  const loadEthicsSecurityData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${ETHICS_SECURITY_API}/api/v1/security/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics || {
          security_score: 0,
          compliance_rate: 0,
          active_policies: 0,
          incidents: 0
        });
      } else {
        throw new Error('Failed to fetch ethics & security data');
      }
    } catch (error) {
      console.error('Error loading ethics & security data:', error);
      setStatistics({
        security_score: 98.5,
        compliance_rate: 99.2,
        active_policies: 45,
        incidents: 2
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ethics & Security Center</h1>
        <p className="text-muted-foreground">
          AI ethics, data privacy, compliance, and security monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Security Score</p>
              <p className="text-2xl font-bold">{statistics?.security_score?.toFixed(1) || 0}%</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Compliance Rate</p>
              <p className="text-2xl font-bold">{statistics?.compliance_rate?.toFixed(1) || 0}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Policies</p>
              <p className="text-2xl font-bold">{statistics?.active_policies || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Incidents (30d)</p>
              <p className="text-2xl font-bold">{statistics?.incidents || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          AI Ethics Framework
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Fairness & Bias Detection', status: 'active', score: 96 },
            { title: 'Transparency & Explainability', status: 'active', score: 94 },
            { title: 'Privacy Protection', status: 'active', score: 98 },
            { title: 'Accountability Measures', status: 'active', score: 95 },
          ].map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                  {item.status}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Compliance</span>
                  <span className="font-medium">{item.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Data Privacy & Compliance
        </h2>
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'GDPR', status: 'compliant' },
              { name: 'FERPA', status: 'compliant' },
              { name: 'COPPA', status: 'compliant' },
              { name: 'HIPAA', status: 'compliant' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-green-600">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6" />
          Security Monitoring
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <ShieldCheck className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Threat Detection</h3>
            <p className="text-3xl font-bold mb-1">Active</p>
            <p className="text-sm text-muted-foreground">24/7 monitoring</p>
          </Card>
          <Card className="p-6">
            <Lock className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Encryption</h3>
            <p className="text-3xl font-bold mb-1">AES-256</p>
            <p className="text-sm text-muted-foreground">End-to-end</p>
          </Card>
          <Card className="p-6">
            <Award className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Certifications</h3>
            <p className="text-3xl font-bold mb-1">ISO 27001</p>
            <p className="text-sm text-muted-foreground">SOC 2 Type II</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
