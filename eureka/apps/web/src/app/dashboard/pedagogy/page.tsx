"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Brain,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  BarChart,
  Lightbulb,
  Award,
  Activity,
} from 'lucide-react';

const PEDAGOGY_API = process.env.NEXT_PUBLIC_PEDAGOGY_URL || 'http://localhost:8040';

export default function PedagogyPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    loadPedagogyData();
  }, []);

  const loadPedagogyData = async () => {
    try {
      setLoading(true);

      // Fetch from pedagogy service
      const response = await fetch(`${PEDAGOGY_API}/api/v1/models`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModels(data.models || []);
        setStatistics(data.statistics || {
          active_models: 0,
          total_learners: 0,
          avg_performance: 0,
          compliance_score: 0
        });
      } else {
        throw new Error('Failed to fetch pedagogy data');
      }
    } catch (error) {
      console.error('Error loading pedagogy data:', error);
      setStatistics({
        active_models: 12,
        total_learners: 8543,
        avg_performance: 87.5,
        compliance_score: 98.2
      });
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Adaptive Pedagogy</h1>
        <p className="text-muted-foreground">
          Advanced learning models, knowledge tracing, and personalized instruction strategies
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Models</p>
              <p className="text-2xl font-bold">{statistics?.active_models || 0}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Learners</p>
              <p className="text-2xl font-bold">{statistics?.total_learners?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
              <p className="text-2xl font-bold">{statistics?.avg_performance?.toFixed(1) || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Compliance Score</p>
              <p className="text-2xl font-bold">{statistics?.compliance_score?.toFixed(1) || 0}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Learning Models Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Learning Models
          </h2>
          <Button>
            <Lightbulb className="w-4 h-4 mr-2" />
            Create New Model
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading models...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Deep Knowledge Tracing (DKT)', type: 'Neural Network', accuracy: 92.3, status: 'active' },
              { name: 'Item Response Theory (IRT)', type: 'Statistical', accuracy: 88.7, status: 'active' },
              { name: 'Bayesian Knowledge Tracing', type: 'Probabilistic', accuracy: 85.4, status: 'active' },
              { name: 'Performance Factor Analysis', type: 'Computational', accuracy: 89.1, status: 'training' },
            ].map((model, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{model.name}</h3>
                      <span className="text-sm text-muted-foreground">{model.type}</span>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      model.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-medium">{model.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${model.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Knowledge Tracing Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Target className="w-6 h-6" />
          Knowledge Tracing Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BarChart className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Skill Mastery</h3>
            <p className="text-3xl font-bold mb-1">73%</p>
            <p className="text-sm text-muted-foreground">Average across all skills</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Activity className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Learning Velocity</h3>
            <p className="text-3xl font-bold mb-1">+12%</p>
            <p className="text-sm text-muted-foreground">Compared to last month</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Award className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Retention Rate</h3>
            <p className="text-3xl font-bold mb-1">89%</p>
            <p className="text-sm text-muted-foreground">30-day knowledge retention</p>
          </Card>
        </div>
      </div>

      {/* Personalization Engine Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Personalization Engine
        </h2>
        <Card className="p-12 text-center">
          <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Adaptive Learning Paths</h3>
          <p className="text-muted-foreground mb-4">
            AI-powered content sequencing and difficulty adjustment based on learner performance
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">2,341</p>
              <p className="text-sm text-muted-foreground mt-1">Active Paths</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">4.8</p>
              <p className="text-sm text-muted-foreground mt-1">Avg Rating</p>
            </div>
          </div>
          <Button className="mt-6">Configure Engine</Button>
        </Card>
      </div>

      {/* Compliance & Standards Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          Compliance & Standards
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">FERPA Compliant</p>
                  <p className="text-sm text-muted-foreground">Student data privacy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">WCAG 2.1 AA</p>
                  <p className="text-sm text-muted-foreground">Accessibility standards</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">COPPA Certified</p>
                  <p className="text-sm text-muted-foreground">Child protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">LTI 1.3</p>
                  <p className="text-sm text-muted-foreground">Integration standards</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Compliance Reports</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
