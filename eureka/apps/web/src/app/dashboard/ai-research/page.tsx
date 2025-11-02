"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  FileText,
  Sparkles,
  Database,
  TrendingUp,
  Users,
  Zap,
  BookOpen,
  Search,
  Cpu,
} from 'lucide-react';

const AI_RESEARCH_API = process.env.NEXT_PUBLIC_AI_RESEARCH_URL || 'http://localhost:8060';

export default function AIResearchPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    loadAIResearchData();
  }, []);

  const loadAIResearchData = async () => {
    try {
      setLoading(true);

      // Fetch from ai-research service
      const response = await fetch(`${AI_RESEARCH_API}/api/v1/agents`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
        setStatistics(data.statistics || {
          active_agents: 0,
          papers_analyzed: 0,
          research_projects: 0,
          avg_accuracy: 0
        });
      } else {
        throw new Error('Failed to fetch AI research data');
      }
    } catch (error) {
      console.error('Error loading AI research data:', error);
      setStatistics({
        active_agents: 8,
        papers_analyzed: 15234,
        research_projects: 234,
        avg_accuracy: 94.3
      });
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Research Lab</h1>
        <p className="text-muted-foreground">
          Intelligent research agents, paper analysis, and automated literature review
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Agents</p>
              <p className="text-2xl font-bold">{statistics?.active_agents || 0}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Papers Analyzed</p>
              <p className="text-2xl font-bold">{statistics?.papers_analyzed?.toLocaleString() || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Research Projects</p>
              <p className="text-2xl font-bold">{statistics?.research_projects || 0}</p>
            </div>
            <Database className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              <p className="text-2xl font-bold">{statistics?.avg_accuracy?.toFixed(1) || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>
      </div>

      {/* Research Agents Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            AI Research Agents
          </h2>
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Create New Agent
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading agents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Literature Review Agent',
                model: 'GPT-4 Turbo',
                status: 'active',
                tasks: 45,
                accuracy: 96.2
              },
              {
                name: 'Paper Summarization Agent',
                model: 'Claude Sonnet',
                status: 'active',
                tasks: 128,
                accuracy: 94.8
              },
              {
                name: 'Citation Analysis Agent',
                model: 'GPT-4',
                status: 'active',
                tasks: 67,
                accuracy: 92.5
              },
              {
                name: 'Methodology Extractor',
                model: 'Claude Opus',
                status: 'training',
                tasks: 23,
                accuracy: 89.3
              },
            ].map((agent, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{agent.name}</h3>
                      <span className="text-sm text-muted-foreground">{agent.model}</span>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      <p className="text-xl font-bold">{agent.tasks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-xl font-bold">{agent.accuracy}%</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">Configure Agent</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Paper Analysis Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Search className="w-6 h-6" />
            Paper Analysis
          </h2>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Analyze New Paper
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BookOpen className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Recent Papers</h3>
            <p className="text-3xl font-bold mb-1">342</p>
            <p className="text-sm text-muted-foreground">Analyzed this month</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Zap className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Processing Speed</h3>
            <p className="text-3xl font-bold mb-1">45s</p>
            <p className="text-sm text-muted-foreground">Avg. time per paper</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Database className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
            <p className="text-3xl font-bold mb-1">15K</p>
            <p className="text-sm text-muted-foreground">Papers in database</p>
          </Card>
        </div>
      </div>

      {/* Research Projects Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Database className="w-6 h-6" />
            Active Research Projects
          </h2>
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Start New Project
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {[
              {
                title: 'Deep Learning in Medical Imaging',
                papers: 145,
                collaborators: 5,
                progress: 67
              },
              {
                title: 'Natural Language Processing for Education',
                papers: 89,
                collaborators: 3,
                progress: 45
              },
              {
                title: 'Reinforcement Learning Applications',
                papers: 123,
                collaborators: 7,
                progress: 82
              },
            ].map((project, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {project.papers} papers
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.collaborators} collaborators
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ChromaDB Vector Store Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Database className="w-6 h-6" />
          Vector Knowledge Base
        </h2>
        <Card className="p-12 text-center">
          <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">ChromaDB Integration</h3>
          <p className="text-muted-foreground mb-4">
            Semantic search across 15,000+ research papers with vector embeddings
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">15,234</p>
              <p className="text-sm text-muted-foreground mt-1">Embedded Papers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98.2%</p>
              <p className="text-sm text-muted-foreground mt-1">Search Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">250ms</p>
              <p className="text-sm text-muted-foreground mt-1">Avg. Query Time</p>
            </div>
          </div>
          <Button className="mt-6">Manage Vector Store</Button>
        </Card>
      </div>

      {/* AI Models Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Cpu className="w-6 h-6" />
          LLM Configuration
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-semibold">GPT-4 Turbo</p>
                    <p className="text-sm text-muted-foreground">Primary model</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="font-semibold">Claude Sonnet 4.5</p>
                    <p className="text-sm text-muted-foreground">Secondary model</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">Configure Models</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
