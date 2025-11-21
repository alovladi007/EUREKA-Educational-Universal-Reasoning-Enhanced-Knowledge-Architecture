'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Brain,
  FileText,
  Stethoscope,
  Heart,
  AlertCircle,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { MEDICAL_ENDPOINTS } from '@/lib/api-endpoints';

const API_BASE_URL = MEDICAL_ENDPOINTS.CASES;

interface ClinicalCase {
  id: string;
  title: string;
  description: string;
  specialty: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  patientAge?: number;
  patientSex?: 'M' | 'F' | 'Other';
  tags: string[];
  timesAttempted: number;
  averageScore: number;
  isPublished: boolean;
  createdAt: string;
}

const complexityColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800',
};

const complexityIcons = {
  beginner: '⭐',
  intermediate: '⭐⭐',
  advanced: '⭐⭐⭐',
  expert: '⭐⭐⭐⭐',
};

const specialtyIcons: Record<string, React.ReactNode> = {
  Cardiology: <Heart className="w-5 h-5 text-red-500" />,
  Pulmonology: <Activity className="w-5 h-5 text-blue-500" />,
  Endocrinology: <Brain className="w-5 h-5 text-purple-500" />,
  default: <Stethoscope className="w-5 h-5 text-gray-500" />,
};

export default function ClinicalCasesPage() {
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const { data: casesData, isLoading } = useQuery({
    queryKey: ['clinical-cases', selectedComplexity, selectedSpecialty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedComplexity) params.append('complexity', selectedComplexity);
      if (selectedSpecialty) params.append('specialty', selectedSpecialty);

      const response = await fetch(`${API_BASE_URL}/cases?${params}`);
      if (!response.ok) throw new Error('Failed to fetch cases');
      return response.json();
    },
  });

  const { data: specialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/cases/specialties/list`);
      if (!response.ok) throw new Error('Failed to fetch specialties');
      return response.json();
    },
  });

  const cases: ClinicalCase[] = casesData?.items || [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Clinical Case Studies</h1>
        <p className="text-gray-600">
          Interactive virtual patient encounters for clinical reasoning development
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{casesData?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{specialties?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">My Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">Start your first case</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
            <p className="text-sm text-gray-500 mt-1">No data yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Complexity Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Complexity Level</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedComplexity === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedComplexity(null)}
                >
                  All
                </Button>
                {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                  <Button
                    key={level}
                    variant={selectedComplexity === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedComplexity(level)}
                  >
                    {complexityIcons[level as keyof typeof complexityIcons]} {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Specialty</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSpecialty === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialty(null)}
                >
                  All Specialties
                </Button>
                {specialties?.map((specialty: string) => (
                  <Button
                    key={specialty}
                    variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty)}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cases...</p>
        </div>
      ) : cases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Cases Found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {specialtyIcons[caseItem.specialty] || specialtyIcons.default}
                    <span className="text-sm font-medium text-gray-600">
                      {caseItem.specialty}
                    </span>
                  </div>
                  <Badge className={complexityColors[caseItem.complexity]}>
                    {complexityIcons[caseItem.complexity]} {caseItem.complexity}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{caseItem.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {caseItem.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {caseItem.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {caseItem.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{caseItem.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Attempts
                    </div>
                    <div className="font-semibold">{caseItem.timesAttempted}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Avg Score
                    </div>
                    <div className="font-semibold">
                      {caseItem.averageScore > 0 ? `${caseItem.averageScore}%` : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/dashboard/medical/cases/${caseItem.id}`}>
                  <Button className="w-full" variant="default">
                    Start Case
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* How It Works Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            How Clinical Cases Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Gather Information</h4>
              <p className="text-sm text-gray-600">
                Take a history, perform physical examination, and order appropriate diagnostic studies
              </p>
            </div>

            <div>
              <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Make a Diagnosis</h4>
              <p className="text-sm text-gray-600">
                Synthesize clinical data to arrive at the most likely diagnosis with differentials
              </p>
            </div>

            <div>
              <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Plan Management</h4>
              <p className="text-sm text-gray-600">
                Propose appropriate treatment and receive detailed feedback on your clinical reasoning
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              6-Component Scoring
            </h4>
            <p className="text-sm text-yellow-800">
              Cases are scored on: History (20%), Physical Exam (20%), Diagnostics (15%), Diagnosis (25%), Management (15%), and Efficiency (5%).
              You'll receive detailed feedback on missed critical actions, unnecessary studies, and diagnostic reasoning.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
