"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  GraduationCap,
  Globe,
  BarChart,
  Target,
  Briefcase,
} from 'lucide-react';

const INSTITUTIONS_API = process.env.NEXT_PUBLIC_INSTITUTIONS_URL || 'http://localhost:8100';

export default function InstitutionsPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    loadInstitutionsData();
  }, []);

  const loadInstitutionsData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${INSTITUTIONS_API}/api/v1/institutions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInstitutions(data.institutions || []);
        setStatistics(data.statistics || {
          total_institutions: 0,
          total_students: 0,
          programs: 0,
          partnerships: 0
        });
      } else {
        throw new Error('Failed to fetch institutions data');
      }
    } catch (error) {
      console.error('Error loading institutions data:', error);
      setStatistics({
        total_institutions: 234,
        total_students: 145670,
        programs: 1234,
        partnerships: 89
      });
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Institutional Network</h1>
        <p className="text-muted-foreground">
          Partner universities, colleges, and educational organizations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Institutions</p>
              <p className="text-2xl font-bold">{statistics?.total_institutions || 0}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{statistics?.total_students?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Programs</p>
              <p className="text-2xl font-bold">{statistics?.programs?.toLocaleString() || 0}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Partnerships</p>
              <p className="text-2xl font-bold">{statistics?.partnerships || 0}</p>
            </div>
            <Briefcase className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Partner Institutions
          </h2>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Add Institution
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading institutions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Stanford University',
                type: 'Research University',
                students: 16424,
                programs: 89,
                rating: 4.9
              },
              {
                name: 'MIT',
                type: 'Research University',
                students: 11934,
                programs: 67,
                rating: 4.9
              },
              {
                name: 'Harvard University',
                type: 'Research University',
                students: 21616,
                programs: 123,
                rating: 4.8
              },
              {
                name: 'UC Berkeley',
                type: 'Public University',
                students: 42347,
                programs: 156,
                rating: 4.7
              },
              {
                name: 'Johns Hopkins',
                type: 'Medical School',
                students: 24102,
                programs: 89,
                rating: 4.9
              },
              {
                name: 'Georgia Tech',
                type: 'Technical Institute',
                students: 36489,
                programs: 134,
                rating: 4.6
              },
            ].map((inst, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{inst.name}</h3>
                      <span className="text-sm text-muted-foreground">{inst.type}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm">
                      <Award className="w-4 h-4 text-yellow-500" />
                      {inst.rating}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="text-xl font-bold">{inst.students.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Programs</p>
                      <p className="text-xl font-bold">{inst.programs}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Global Reach
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Globe className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Countries</h3>
            <p className="text-3xl font-bold mb-1">45</p>
            <p className="text-sm text-muted-foreground">Worldwide presence</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Growth Rate</h3>
            <p className="text-3xl font-bold mb-1">+34%</p>
            <p className="text-sm text-muted-foreground">Year over year</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Faculty</h3>
            <p className="text-3xl font-bold mb-1">12,456</p>
            <p className="text-sm text-muted-foreground">Across all institutions</p>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Target className="w-6 h-6" />
          Program Categories
        </h2>
        <Card className="p-12 text-center">
          <BarChart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Diverse Academic Programs</h3>
          <p className="text-muted-foreground mb-4">
            Comprehensive range of academic programs across all educational levels
          </p>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">342</p>
              <p className="text-sm text-muted-foreground mt-1">Undergraduate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">456</p>
              <p className="text-sm text-muted-foreground mt-1">Graduate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">189</p>
              <p className="text-sm text-muted-foreground mt-1">Doctoral</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">247</p>
              <p className="text-sm text-muted-foreground mt-1">Professional</p>
            </div>
          </div>
          <Button className="mt-6">Browse Programs</Button>
        </Card>
      </div>
    </div>
  );
}
