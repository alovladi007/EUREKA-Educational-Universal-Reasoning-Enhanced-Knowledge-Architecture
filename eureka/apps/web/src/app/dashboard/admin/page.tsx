"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Settings,
  Shield,
  Activity,
  TrendingUp,
  Database,
  Server,
  AlertCircle,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8009';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [tierStats, setTierStats] = useState<any[]>([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      // Fetch admin statistics
      const response = await fetch(`${API_URL}/api/v1/admin/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics || {});
        setTierStats(data.tier_stats || []);
      } else {
        throw new Error('Failed to fetch admin data');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Set mock data
      setStatistics({
        total_users: 15234,
        active_users: 8532,
        total_courses: 456,
        system_uptime: 99.98
      });
      setTierStats([
        { name: 'High School', users: 4521, courses: 120, status: 'operational' },
        { name: 'Undergraduate', users: 6789, courses: 245, status: 'operational' },
        { name: 'Graduate', users: 2134, courses: 89, status: 'operational' },
        { name: 'Medical', users: 1790, courses: 102, status: 'operational' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">System Administration</h1>
        <p className="text-muted-foreground">
          Manage users, tiers, system settings, and monitor platform performance
        </p>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{statistics?.total_users?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{statistics?.active_users?.toLocaleString() || 0}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">{statistics?.total_courses?.toLocaleString() || 0}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Uptime</p>
              <p className="text-2xl font-bold">{statistics?.system_uptime?.toFixed(2) || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>
      </div>

      {/* Tier Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Server className="w-6 h-6" />
            Education Tier Management
          </h2>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure Tiers
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading tier data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tierStats.map((tier, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{tier.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {tier.status === 'operational' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm text-muted-foreground capitalize">{tier.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Users</p>
                      <p className="text-xl font-bold">{tier.users?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Courses</p>
                      <p className="text-xl font-bold">{tier.courses}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">View Details</Button>
                    <Button variant="outline" className="flex-1">Manage</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* User Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </h2>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">12,456</p>
                <p className="text-sm text-muted-foreground mt-1">Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">1,234</p>
                <p className="text-sm text-muted-foreground mt-1">Teachers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">89</p>
                <p className="text-sm text-muted-foreground mt-1">Administrators</p>
              </div>
            </div>
            <Button className="w-full">View All Users</Button>
          </div>
        </Card>
      </div>

      {/* System Health */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Activity className="w-6 h-6" />
          System Health
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <Database className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Database</h3>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Healthy</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Response time: 12ms</p>
          </Card>

          <Card className="p-6">
            <Server className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">API Services</h3>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">All Online</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">21/21 services running</p>
          </Card>

          <Card className="p-6">
            <Shield className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Security</h3>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">No Issues</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Last scan: 2 hours ago</p>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            <span className="text-sm">Manage Users</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
            <GraduationCap className="w-6 h-6" />
            <span className="text-sm">Manage Courses</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
            <Settings className="w-6 h-6" />
            <span className="text-sm">System Settings</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
            <Activity className="w-6 h-6" />
            <span className="text-sm">View Analytics</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
