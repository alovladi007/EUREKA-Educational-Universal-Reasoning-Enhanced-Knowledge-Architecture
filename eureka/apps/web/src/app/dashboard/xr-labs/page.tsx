"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Glasses,
  Box,
  Play,
  Users,
  TrendingUp,
  Award,
  Zap,
  Cpu,
  Globe,
  Layers,
} from 'lucide-react';

const XR_LABS_API = process.env.NEXT_PUBLIC_XR_LABS_URL || 'http://localhost:8070';

export default function XRLabsPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [simulations, setSimulations] = useState<any[]>([]);

  useEffect(() => {
    loadXRLabsData();
  }, []);

  const loadXRLabsData = async () => {
    try {
      setLoading(true);

      // Fetch from xr-labs service
      const response = await fetch(`${XR_LABS_API}/api/v1/simulations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSimulations(data.simulations || []);
        setStatistics(data.statistics || {
          active_simulations: 0,
          total_users: 0,
          avg_engagement: 0,
          vr_sessions: 0
        });
      } else {
        throw new Error('Failed to fetch XR Labs data');
      }
    } catch (error) {
      console.error('Error loading XR Labs data:', error);
      setStatistics({
        active_simulations: 45,
        total_users: 5432,
        avg_engagement: 92.5,
        vr_sessions: 12345
      });
      setSimulations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">XR Learning Labs</h1>
        <p className="text-muted-foreground">
          Virtual Reality, Augmented Reality, and immersive learning simulations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Simulations</p>
              <p className="text-2xl font-bold">{statistics?.active_simulations || 0}</p>
            </div>
            <Box className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{statistics?.total_users?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
              <p className="text-2xl font-bold">{statistics?.avg_engagement?.toFixed(1) || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">VR Sessions</p>
              <p className="text-2xl font-bold">{statistics?.vr_sessions?.toLocaleString() || 0}</p>
            </div>
            <Glasses className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Simulations Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Box className="w-6 h-6" />
            Available Simulations
          </h2>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Create New Simulation
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading simulations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Medical Surgery Simulator',
                type: 'VR',
                category: 'Medical',
                users: 1234,
                rating: 4.9
              },
              {
                title: 'Chemistry Lab Experience',
                type: 'AR',
                category: 'Science',
                users: 2341,
                rating: 4.7
              },
              {
                title: 'Historical Site Exploration',
                type: 'VR',
                category: 'History',
                users: 876,
                rating: 4.8
              },
              {
                title: 'Engineering Design Studio',
                type: 'VR',
                category: 'Engineering',
                users: 1567,
                rating: 4.6
              },
              {
                title: 'Anatomy 3D Visualization',
                type: 'AR',
                category: 'Medical',
                users: 3245,
                rating: 4.9
              },
              {
                title: 'Physics Lab Experiments',
                type: 'VR',
                category: 'Science',
                users: 1890,
                rating: 4.5
              },
            ].map((sim, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{sim.title}</h3>
                      <p className="text-sm text-muted-foreground">{sim.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      sim.type === 'VR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {sim.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {sim.users.toLocaleString()} users
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-yellow-500" />
                      {sim.rating} ★
                    </span>
                  </div>

                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-1" />
                    Launch
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* VR Experience Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Glasses className="w-6 h-6" />
          VR Experience Center
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Glasses className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold mb-1">234</p>
            <p className="text-sm text-muted-foreground">Currently in VR</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Zap className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Avg Session Time</h3>
            <p className="text-3xl font-bold mb-1">42min</p>
            <p className="text-sm text-muted-foreground">Per learning session</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold mb-1">87%</p>
            <p className="text-sm text-muted-foreground">Finish simulations</p>
          </Card>
        </div>
      </div>

      {/* AR Features Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Layers className="w-6 h-6" />
          Augmented Reality Features
        </h2>
        <Card className="p-12 text-center">
          <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Mixed Reality Learning</h3>
          <p className="text-muted-foreground mb-4">
            Overlay digital content onto the physical world for enhanced learning experiences
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">15+</p>
              <p className="text-sm text-muted-foreground mt-1">AR Modules</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">95%</p>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">2.3K</p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
          </div>
          <Button className="mt-6">Explore AR Content</Button>
        </Card>
      </div>

      {/* Hardware & Platform Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Cpu className="w-6 h-6" />
          Supported Hardware
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <Glasses className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold">Meta Quest</p>
                <p className="text-xs text-muted-foreground">Quest 2 & 3</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Glasses className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="font-semibold">HTC Vive</p>
                <p className="text-xs text-muted-foreground">All models</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Glasses className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold">Valve Index</p>
                <p className="text-xs text-muted-foreground">Full support</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="font-semibold">WebXR</p>
                <p className="text-xs text-muted-foreground">Browser-based</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Compatibility Guide</Button>
          </div>
        </Card>
      </div>

      {/* Content Creation Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Box className="w-6 h-6" />
          Content Creation Studio
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create custom VR/AR experiences with our no-code builder
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Scene Builder</h4>
                <p className="text-sm text-muted-foreground">Drag-and-drop 3D environment creation</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Asset Library</h4>
                <p className="text-sm text-muted-foreground">10,000+ 3D models and textures</p>
              </div>
            </div>
            <Button className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Launch Studio
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
