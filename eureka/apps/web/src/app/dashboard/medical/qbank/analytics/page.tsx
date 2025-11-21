'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Brain,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { formatPercentage } from '@/lib/utils';
import { MEDICAL_ENDPOINTS } from '@/lib/api-endpoints';

const API_BASE_URL = MEDICAL_ENDPOINTS.CASES;

interface IRTMetrics {
  itemId: string;
  stem: string;
  difficulty: number; // b parameter (0-1, higher = harder)
  discrimination: number; // a parameter (0-4, higher = better)
  pointBiserial: number; // correlation (-1 to 1)
  attempts: number;
  correctRate: number;
  avgTimeSeconds: number;
}

interface PerformanceByDifficulty {
  difficulty: string;
  totalQuestions: number;
  avgCorrectRate: number;
  avgTimeSeconds: number;
}

// Mock IRT data generator (in production, this would come from backend)
function generateMockIRTData(items: any[]): IRTMetrics[] {
  return items.map((item) => {
    const correctRate = Math.random() * 0.6 + 0.3; // 30-90%
    const difficulty = 1 - correctRate; // Higher correct rate = lower difficulty
    const discrimination = Math.random() * 2 + 1; // 1-3
    const pointBiserial = Math.random() * 0.6 + 0.2; // 0.2-0.8

    return {
      itemId: item.id,
      stem: item.stem,
      difficulty,
      discrimination,
      pointBiserial,
      attempts: Math.floor(Math.random() * 100) + 20,
      correctRate,
      avgTimeSeconds: Math.floor(Math.random() * 90) + 30,
    };
  });
}

export default function QBankAnalyticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['qbank-items'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/items?limit=100`);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      return data.items;
    },
  });

  const irtData: IRTMetrics[] = items ? generateMockIRTData(items) : [];

  // Calculate aggregated metrics
  const avgDifficulty = irtData.length > 0
    ? irtData.reduce((sum, item) => sum + item.difficulty, 0) / irtData.length
    : 0;

  const avgDiscrimination = irtData.length > 0
    ? irtData.reduce((sum, item) => sum + item.discrimination, 0) / irtData.length
    : 0;

  const avgPointBiserial = irtData.length > 0
    ? irtData.reduce((sum, item) => sum + item.pointBiserial, 0) / irtData.length
    : 0;

  // Categorize items by difficulty
  const easyItems = irtData.filter(item => item.difficulty < 0.33);
  const mediumItems = irtData.filter(item => item.difficulty >= 0.33 && item.difficulty < 0.67);
  const hardItems = irtData.filter(item => item.difficulty >= 0.67);

  // Categorize by discrimination
  const highDiscrimination = irtData.filter(item => item.discrimination >= 2.0);
  const mediumDiscrimination = irtData.filter(item => item.discrimination >= 1.0 && item.discrimination < 2.0);
  const lowDiscrimination = irtData.filter(item => item.discrimination < 1.0);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/medical/qbank">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to QBank
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold mb-2">IRT Analytics Dashboard</h1>
          <p className="text-gray-600">
            Item Response Theory metrics for question bank performance analysis
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{irtData.length}</div>
            <p className="text-sm text-gray-500 mt-1">Analyzed questions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Avg Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgDifficulty.toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-1">0 = easy, 1 = hard</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg Discrimination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgDiscrimination.toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-1">Higher = better</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Avg Point-Biserial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgPointBiserial.toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-1">Correlation metric</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Difficulty Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Difficulty Distribution
            </CardTitle>
            <CardDescription>Question distribution by difficulty level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Easy (b &lt; 0.33)</span>
                  <span className="text-sm font-semibold">{easyItems.length} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${(easyItems.length / irtData.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Avg correct rate: {formatPercentage((1 - (easyItems.reduce((s, i) => s + i.difficulty, 0) / easyItems.length || 0)) * 100)}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-700">Medium (0.33 ≤ b &lt; 0.67)</span>
                  <span className="text-sm font-semibold">{mediumItems.length} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{ width: `${(mediumItems.length / irtData.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Avg correct rate: {formatPercentage((1 - (mediumItems.reduce((s, i) => s + i.difficulty, 0) / mediumItems.length || 0)) * 100)}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-red-700">Hard (b ≥ 0.67)</span>
                  <span className="text-sm font-semibold">{hardItems.length} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: `${(hardItems.length / irtData.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Avg correct rate: {formatPercentage((1 - (hardItems.reduce((s, i) => s + i.difficulty, 0) / hardItems.length || 0)) * 100)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discrimination Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Discrimination Quality
            </CardTitle>
            <CardDescription>How well items distinguish performance levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">High (a ≥ 2.0)</span>
                  <span className="text-sm font-semibold">{highDiscrimination.length} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${(highDiscrimination.length / irtData.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Excellent at differentiating ability levels
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-700">Medium (1.0 ≤ a &lt; 2.0)</span>
                  <span className="text-sm font-semibold">{mediumDiscrimination.length} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{ width: `${(mediumDiscrimination.length / irtData.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Moderate discrimination power
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-red-700">Low (a &lt; 1.0)</span>
                  <span className="text-sm font-semibold">{lowDiscrimination.length} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: `${(lowDiscrimination.length / irtData.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Needs review - poor discrimination
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Item Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Item-Level IRT Metrics
          </CardTitle>
          <CardDescription>
            Detailed psychometric analysis of individual questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="excellent">Excellent (a ≥ 2.0)</TabsTrigger>
              <TabsTrigger value="review">Needs Review (a &lt; 1.0)</TabsTrigger>
              <TabsTrigger value="hard">Difficult (b ≥ 0.7)</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {irtData.slice(0, 20).map((item) => (
                  <div key={item.itemId} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2 flex-1">{item.stem}</h4>
                      <div className="flex gap-2 ml-4">
                        {item.discrimination >= 2.0 && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">High Disc.</span>
                        )}
                        {item.difficulty >= 0.7 && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Hard</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Difficulty (b):</span>
                        <span className="ml-2 font-semibold">{item.difficulty.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Discrimination (a):</span>
                        <span className="ml-2 font-semibold">{item.discrimination.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Point-Biserial:</span>
                        <span className="ml-2 font-semibold">{item.pointBiserial.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Correct Rate:</span>
                        <span className="ml-2 font-semibold">{formatPercentage(item.correctRate * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="excellent" className="mt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {highDiscrimination.slice(0, 20).map((item) => (
                  <div key={item.itemId} className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2 flex-1">{item.stem}</h4>
                      <CheckCircle className="w-5 h-5 text-green-600 ml-4" />
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Difficulty (b):</span>
                        <span className="ml-2 font-semibold">{item.difficulty.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Discrimination (a):</span>
                        <span className="ml-2 font-semibold text-green-700">{item.discrimination.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Point-Biserial:</span>
                        <span className="ml-2 font-semibold">{item.pointBiserial.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Correct Rate:</span>
                        <span className="ml-2 font-semibold">{formatPercentage(item.correctRate * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="review" className="mt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {lowDiscrimination.slice(0, 20).map((item) => (
                  <div key={item.itemId} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2 flex-1">{item.stem}</h4>
                      <AlertCircle className="w-5 h-5 text-red-600 ml-4" />
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Difficulty (b):</span>
                        <span className="ml-2 font-semibold">{item.difficulty.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Discrimination (a):</span>
                        <span className="ml-2 font-semibold text-red-700">{item.discrimination.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Point-Biserial:</span>
                        <span className="ml-2 font-semibold">{item.pointBiserial.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Correct Rate:</span>
                        <span className="ml-2 font-semibold">{formatPercentage(item.correctRate * 100)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-red-700 mt-2">
                      ⚠️ Low discrimination - this item may not effectively differentiate between high and low performers
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hard" className="mt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {hardItems.slice(0, 20).map((item) => (
                  <div key={item.itemId} className="p-4 border rounded-lg bg-orange-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2 flex-1">{item.stem}</h4>
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded ml-4">Challenging</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Difficulty (b):</span>
                        <span className="ml-2 font-semibold text-orange-700">{item.difficulty.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Discrimination (a):</span>
                        <span className="ml-2 font-semibold">{item.discrimination.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Point-Biserial:</span>
                        <span className="ml-2 font-semibold">{item.pointBiserial.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Correct Rate:</span>
                        <span className="ml-2 font-semibold">{formatPercentage(item.correctRate * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* IRT Explanation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Understanding IRT Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Difficulty Parameter (b)
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Measures how hard a question is. Values range from 0 (easy) to 1 (hard).
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• b &lt; 0.33: Easy question</li>
                <li>• 0.33 ≤ b &lt; 0.67: Medium difficulty</li>
                <li>• b ≥ 0.67: Difficult question</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Discrimination Parameter (a)
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Measures how well a question differentiates between high and low performers.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• a &lt; 1.0: Poor discrimination</li>
                <li>• 1.0 ≤ a &lt; 2.0: Moderate discrimination</li>
                <li>• a ≥ 2.0: Excellent discrimination</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                Point-Biserial Correlation
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Correlation between item scores and total test scores.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• &lt; 0.2: Weak correlation</li>
                <li>• 0.2-0.4: Moderate correlation</li>
                <li>• &gt; 0.4: Strong correlation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
