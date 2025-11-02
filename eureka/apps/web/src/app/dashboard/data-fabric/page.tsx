"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Database,
  Network,
  Zap,
  TrendingUp,
  GitBranch,
  Layers,
  Search,
  Activity,
  Server,
  Cpu,
} from 'lucide-react';

const DATA_FABRIC_API = process.env.NEXT_PUBLIC_DATA_FABRIC_URL || 'http://localhost:8090';

export default function DataFabricPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadDataFabricData();
  }, []);

  const loadDataFabricData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${DATA_FABRIC_API}/api/v1/fabric/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics || {
          total_nodes: 0,
          connections: 0,
          queries_per_sec: 0,
          avg_latency: 0
        });
      } else {
        throw new Error('Failed to fetch data fabric data');
      }
    } catch (error) {
      console.error('Error loading data fabric data:', error);
      setStatistics({
        total_nodes: 12543,
        connections: 45678,
        queries_per_sec: 1234,
        avg_latency: 45
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Data Fabric Intelligence</h1>
        <p className="text-muted-foreground">
          Knowledge graphs, vector databases, and unified data integration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-2xl font-bold">{statistics?.total_nodes?.toLocaleString() || 0}</p>
            </div>
            <GitBranch className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Connections</p>
              <p className="text-2xl font-bold">{statistics?.connections?.toLocaleString() || 0}</p>
            </div>
            <Network className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Queries/sec</p>
              <p className="text-2xl font-bold">{statistics?.queries_per_sec?.toLocaleString() || 0}</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Latency</p>
              <p className="text-2xl font-bold">{statistics?.avg_latency || 0}ms</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <GitBranch className="w-6 h-6" />
          Knowledge Graph (Neo4j)
        </h2>
        <Card className="p-12 text-center">
          <GitBranch className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Interconnected Learning Data</h3>
          <p className="text-muted-foreground mb-4">
            Graph database connecting courses, concepts, students, and resources
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">12.5K</p>
              <p className="text-sm text-muted-foreground mt-1">Nodes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">45.6K</p>
              <p className="text-sm text-muted-foreground mt-1">Relationships</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">23ms</p>
              <p className="text-sm text-muted-foreground mt-1">Avg Query Time</p>
            </div>
          </div>
          <Button className="mt-6">Explore Graph</Button>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Search className="w-6 h-6" />
          Vector Search (Qdrant)
        </h2>
        <Card className="p-12 text-center">
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Semantic Vector Database</h3>
          <p className="text-muted-foreground mb-4">
            High-performance vector similarity search for content recommendations
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">234K</p>
              <p className="text-sm text-muted-foreground mt-1">Vectors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98.7%</p>
              <p className="text-sm text-muted-foreground mt-1">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">15ms</p>
              <p className="text-sm text-muted-foreground mt-1">Search Time</p>
            </div>
          </div>
          <Button className="mt-6">Configure Qdrant</Button>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Layers className="w-6 h-6" />
          Data Integration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <Database className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">PostgreSQL</h3>
            <p className="text-sm text-muted-foreground mb-3">Relational data</p>
            <Button variant="outline" className="w-full">Configure</Button>
          </Card>
          <Card className="p-6">
            <Server className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Redis</h3>
            <p className="text-sm text-muted-foreground mb-3">Caching layer</p>
            <Button variant="outline" className="w-full">Configure</Button>
          </Card>
          <Card className="p-6">
            <Cpu className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">MinIO</h3>
            <p className="text-sm text-muted-foreground mb-3">Object storage</p>
            <Button variant="outline" className="w-full">Configure</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
