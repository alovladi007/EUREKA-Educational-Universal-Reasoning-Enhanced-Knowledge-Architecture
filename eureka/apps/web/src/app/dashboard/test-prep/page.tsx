'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  Calendar,
  Trophy,
  Flame,
  Clock,
  TrendingUp,
  Sparkles,
  Lightbulb,
  Target,
  Brain,
  Zap
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { apiClient } from '@/lib/api-client';
import { EXAM_TYPE_LIST, getExamConfig } from '@/lib/exam-config';
import { PatentBarCohortPanel } from '@/components/test-prep/patent/PatentBarCohortPanel';

interface UserStats {
  total_questions: number;
  overall_accuracy: number;
  current_streak: number;
  questions_today: number;
  total_study_time: number;
  ability_level: string;
}

interface Activity {
  type: string;
  time: string;
  details: string;
}

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  importance: number;
  actionable: boolean;
  recommendations: string[];
}

interface Recommendation {
  id: string;
  priority: string;
  type: string;
  title: string;
  description: string;
  estimated_impact: string;
  time_required: string;
}

export default function TestPrepDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [readinessScore, setReadinessScore] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [examType, setExamType] = useState('GRE');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    try {
      // Fetch real QBank stats for the selected exam type
      const qbankStats = await apiClient.getQBankStats(examType).catch(() => null);
      const qbankHistory = await apiClient.getQBankHistory(examType).catch(() => ({ sessions: [] }));

      clearTimeout(loadingTimeout);

      // Compute real stats from QBank session history
      const sessions = qbankHistory.sessions || [];
      const totalQuestions = sessions.reduce((sum: number, s: any) => sum + (s.questions_answered || 0), 0);
      const totalCorrect = sessions.reduce((sum: number, s: any) => sum + (s.correct_count || 0), 0);
      const totalTime = sessions.reduce((sum: number, s: any) => sum + (s.total_time_seconds || 0), 0);
      const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      setStats({
        total_questions: totalQuestions,
        overall_accuracy: overallAccuracy,
        current_streak: 0,
        questions_today: 0,
        total_study_time: totalTime,
        ability_level: totalQuestions === 0 ? 'New' : totalQuestions < 50 ? 'Beginner' : totalQuestions < 200 ? 'Intermediate' : 'Advanced'
      });

      // Build real performance data from session history (last 7 sessions)
      if (sessions.length > 0) {
        const recentSessions = sessions.slice(0, 7).reverse();
        setPerformanceData(recentSessions.map((s: any, i: number) => ({
          day: s.completed_at ? new Date(s.completed_at).toLocaleDateString('en-US', { weekday: 'short' }) : `S${i + 1}`,
          accuracy: Math.round(s.score_percent || 0),
          questions: s.questions_answered || 0,
        })));
      } else {
        setPerformanceData([]);
      }

      // Build real recommendations from QBank section stats
      if (qbankStats?.sections && qbankStats.sections.length > 0) {
        setRecommendations(qbankStats.sections.map((sec: any, idx: number) => ({
          id: `rec-${idx}`,
          priority: idx < 3 ? 'high' : 'medium',
          type: 'domain',
          title: sec.section,
          description: `${sec.count} questions available — practice this domain`,
          estimated_impact: 'High',
          time_required: `${Math.round(sec.count * 2)} minutes`
        })));

        setInsights(qbankStats.sections.slice(0, 3).map((sec: any, idx: number) => ({
          id: `insight-${idx}`,
          type: 'opportunity',
          title: sec.section,
          description: `${sec.count} practice questions available`,
          importance: 0.7,
          actionable: true,
          recommendations: [`Start a ${Math.min(sec.count, 25)}-question practice session on ${sec.section}`]
        })));
      } else {
        setRecommendations([]);
        setInsights([]);
      }

      // Build real recent activity from session history
      if (sessions.length > 0) {
        setRecentActivity(sessions.slice(0, 5).map((s: any) => ({
          type: `${s.mode === 'tutor' ? 'Practice' : 'Timed'} Session`,
          time: s.completed_at ? new Date(s.completed_at).toLocaleString() : 'Recent',
          details: `${s.correct_count || 0}/${s.questions_answered || 0} correct (${Math.round(s.score_percent || 0)}%)`
        })));
      } else {
        setRecentActivity([]);
      }

      setUser(null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      clearTimeout(loadingTimeout);

      setStats({
        total_questions: 0,
        overall_accuracy: 0,
        current_streak: 0,
        questions_today: 0,
        total_study_time: 0,
        ability_level: 'New'
      });
      setPerformanceData([]);
      setRecommendations([]);
      setInsights([]);
      setRecentActivity([]);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [examType]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Test Prep Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and optimize your study plan
          </p>
        </div>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {EXAM_TYPE_LIST.map((exam) => (
            <option key={exam.id} value={exam.id}>{exam.shortName}</option>
          ))}
        </select>
      </div>

      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {getExamConfig(examType).name} Prep
            </h2>
            <p className="text-muted-foreground">
              {(stats?.total_questions || 0) > 0
                ? `${stats?.total_questions} questions answered · ${stats?.overall_accuracy || 0}% accuracy`
                : 'Start practicing to track your progress'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Level</p>
            <p className="text-2xl font-bold">{stats?.ability_level || 'Beginner'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Readiness Score</p>
            <p className="text-xl font-semibold mt-1">
              {readinessScore?.overall_score ? `${Math.round(readinessScore.overall_score * 100)}%` : 'N/A'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Questions Today</p>
            <p className="text-xl font-semibold mt-1">{stats?.questions_today || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Overall Accuracy</p>
            <p className="text-xl font-semibold mt-1">
              {stats?.overall_accuracy ? `${Math.round(stats.overall_accuracy)}%` : '0%'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Predicted Score</p>
            <p className="text-xl font-semibold mt-1">
              {predictions?.exam_score?.expected || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/dashboard/test-prep/${examType.toLowerCase()}`}>
            <Button className="w-full sm:w-auto">
              <Target className="w-4 h-4 mr-2" />
              Start Studying: Lessons, Notes & QBank
            </Button>
          </Link>
          <Link href="/test-prep/pricing">
            <Button variant="outline" className="w-full sm:w-auto">
              View Prep Plans
            </Button>
          </Link>
        </div>
      </Card>

      {/* Exam Info */}
      {examType && (
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{getExamConfig(examType).name}</p>
              <p className="text-xs text-muted-foreground">
                {getExamConfig(examType).description} &middot; Score range: {getExamConfig(examType).scoreRange.label} &middot;{' '}
                {getExamConfig(examType).sections.length} sections &middot; {getExamConfig(examType).totalDuration} min
              </p>
            </div>
          </div>
        </Card>
      )}

      {examType === 'PATENT_BAR' && <PatentBarCohortPanel />}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href={`/dashboard/test-prep/practice?exam=${examType}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <BookOpen className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-1">Adaptive Practice</h3>
              <p className="text-sm text-muted-foreground">IRT-based {examType} questions</p>
            </Card>
          </Link>

          <Link href={`/dashboard/test-prep/exam?exam=${examType}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <GraduationCap className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-1">Mock Exam</h3>
              <p className="text-sm text-muted-foreground">Full {examType} simulation</p>
            </Card>
          </Link>

          <Link href={`/dashboard/test-prep/analytics?exam=${examType}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <BarChart3 className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-muted-foreground">Track {examType} progress</p>
            </Card>
          </Link>

          <Link href={`/dashboard/test-prep/study-plan?exam=${examType}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Calendar className="h-8 w-8 text-orange-500 mb-3" />
              <h3 className="font-semibold mb-1">AI Study Plan</h3>
              <p className="text-sm text-muted-foreground">Personalized {examType} schedule</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold mt-1">{stats?.current_streak || 0} days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold mt-1">{stats?.total_questions || 0}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round((stats?.total_study_time || 0) / 60)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                <p className="text-2xl font-bold mt-1">
                  {stats?.overall_accuracy ? Math.round(stats.overall_accuracy) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </div>
      </div>

      {/* Performance Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Performance Trends</h2>
          <span className="text-sm text-muted-foreground">Last 7 days</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="accuracy"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              name="Accuracy (%)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="questions"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Questions"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">AI Insights</h2>
          </div>

          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.slice(0, 3).map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'strength'
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                      : insight.type === 'weakness'
                      ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                      : 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{insight.title}</p>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      {insight.actionable && insight.recommendations.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 {insight.recommendations[0]}
                        </p>
                      )}
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        insight.importance >= 0.8
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : insight.importance >= 0.5
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {insight.importance >= 0.8 ? 'High' : insight.importance >= 0.5 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Complete more practice sessions to get AI-powered insights</p>
              </div>
            )}
          </div>

          {insights.length > 0 && (
            <Link href="/dashboard/test-prep/analytics">
              <Button variant="outline" className="w-full mt-4">
                View All Insights
              </Button>
            </Link>
          )}
        </Card>

        {/* AI Recommendations */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold">AI Recommendations</h2>
          </div>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.time_required}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {rec.estimated_impact}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Complete practice sessions to get personalized recommendations</p>
              </div>
            )}
          </div>

          {recommendations.length > 0 && (
            <Link href="/dashboard/test-prep/study-plan">
              <Button variant="outline" className="w-full mt-4">
                View Full Study Plan
              </Button>
            </Link>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.details}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          )}
        </div>

        {recentActivity.length > 0 && (
          <Link href="/dashboard/test-prep/analytics">
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </Link>
        )}
      </Card>
    </div>
  );
}
