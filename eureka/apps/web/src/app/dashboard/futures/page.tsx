"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Rocket,
  TrendingUp,
  Lightbulb,
  Brain,
  Zap,
  Target,
  Sparkles,
  Globe,
  Award,
  Activity,
} from 'lucide-react';

const FUTURES_API = process.env.NEXT_PUBLIC_FUTURES_URL || 'http://localhost:8110';

export default function FuturesPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadFuturesData();
  }, []);

  const loadFuturesData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${FUTURES_API}/api/v1/futures/trends`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics || {
          active_innovations: 0,
          research_projects: 0,
          predictions: 0,
          impact_score: 0
        });
      } else {
        throw new Error('Failed to fetch futures data');
      }
    } catch (error) {
      console.error('Error loading futures data:', error);
      setStatistics({
        active_innovations: 23,
        research_projects: 67,
        predictions: 145,
        impact_score: 94.5
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Future of Education</h1>
        <p className="text-muted-foreground">
          Innovation lab, future trends, emerging technologies, and strategic foresight
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Innovations</p>
              <p className="text-2xl font-bold">{statistics?.active_innovations || 0}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Research Projects</p>
              <p className="text-2xl font-bold">{statistics?.research_projects || 0}</p>
            </div>
            <Rocket className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Predictions</p>
              <p className="text-2xl font-bold">{statistics?.predictions || 0}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Impact Score</p>
              <p className="text-2xl font-bold">{statistics?.impact_score?.toFixed(1) || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Emerging Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Quantum Computing for Education',
              readiness: 'Experimental',
              impact: 'High',
              timeline: '2028-2030'
            },
            {
              title: 'Brain-Computer Interfaces',
              readiness: 'Research',
              impact: 'Very High',
              timeline: '2030-2035'
            },
            {
              title: 'Advanced AI Tutors',
              readiness: 'Early Adoption',
              impact: 'High',
              timeline: '2025-2027'
            },
            {
              title: 'Holographic Classrooms',
              readiness: 'Prototype',
              impact: 'Medium',
              timeline: '2026-2028'
            },
            {
              title: 'Personalized Learning DNA',
              readiness: 'Research',
              impact: 'Very High',
              timeline: '2030-2035'
            },
            {
              title: 'Decentralized Credentials',
              readiness: 'Early Adoption',
              impact: 'High',
              timeline: '2024-2026'
            },
          ].map((tech, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{tech.title}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Readiness</span>
                    <span className="font-medium">{tech.readiness}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impact</span>
                    <span className={`font-medium ${
                      tech.impact === 'Very High' ? 'text-red-600' :
                      tech.impact === 'High' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>{tech.impact}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-medium">{tech.timeline}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Learn More</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Target className="w-6 h-6" />
          Strategic Initiatives
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            {[
              {
                title: 'AI-Native Curriculum Design',
                status: 'Active',
                progress: 67,
                team: 12
              },
              {
                title: 'Metaverse Learning Environments',
                status: 'Planning',
                progress: 23,
                team: 8
              },
              {
                title: 'Global Micro-Credentials Network',
                status: 'Active',
                progress: 45,
                team: 15
              },
            ].map((initiative, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{initiative.title}</h3>
                    <p className="text-sm text-muted-foreground">{initiative.team} team members</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    initiative.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {initiative.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{initiative.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Trend Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Activity className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Learning Modalities</h3>
            <p className="text-3xl font-bold mb-1">Hybrid+</p>
            <p className="text-sm text-muted-foreground">Dominant model by 2026</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Zap className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">AI Adoption</h3>
            <p className="text-3xl font-bold mb-1">89%</p>
            <p className="text-sm text-muted-foreground">Expected by 2026</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Globe className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Global Access</h3>
            <p className="text-3xl font-bold mb-1">+2.3B</p>
            <p className="text-sm text-muted-foreground">New learners by 2030</p>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Innovation Lab
        </h2>
        <Card className="p-12 text-center">
          <Rocket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Experimental Features</h3>
          <p className="text-muted-foreground mb-4">
            Test cutting-edge educational technologies before they launch
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">15</p>
              <p className="text-sm text-muted-foreground mt-1">Experiments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">234</p>
              <p className="text-sm text-muted-foreground mt-1">Beta Testers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
            </div>
          </div>
          <Button className="mt-6">Join Beta Program</Button>
        </Card>
      </div>
    </div>
  );
}
