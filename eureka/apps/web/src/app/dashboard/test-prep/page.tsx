'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { apiClient } from '@/lib/api-client';

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
    console.log('[Dashboard] fetchDashboardData started with examType:', examType);
    setLoading(true);

    // Set a timeout to ensure we stop loading even if API fails
    const loadingTimeout = setTimeout(() => {
      console.warn('[Dashboard] Loading timeout - showing default data');
      setLoading(false);
    }, 3000);

    try {
      // Use only the working endpoints
      console.log('[Dashboard] Making API calls...');
      const [statsRes, activityRes, recRes] = await Promise.all([
        apiClient.getUserStats().catch(e => { console.error('[Dashboard] getUserStats failed:', e); throw e; }),
        apiClient.getUserProgress().catch(e => { console.error('[Dashboard] getUserProgress failed:', e); throw e; }),
        apiClient.getAdaptiveLearningPath(examType).catch(e => { console.error('[Dashboard] getAdaptiveLearningPath failed:', e); throw e; })
      ]);
      console.log('[Dashboard] API calls completed', { statsRes, activityRes, recRes });
      clearTimeout(loadingTimeout);

      setStats({
        total_questions: statsRes.total_questions || statsRes.total_questions_answered || 0,
        overall_accuracy: statsRes.overall_accuracy || 0,
        current_streak: statsRes.current_streak || statsRes.current_streak_days || 0,
        questions_today: statsRes.questions_today || 0,
        total_study_time: statsRes.total_study_time || statsRes.total_study_time_minutes || 0,
        ability_level: statsRes.ability_level || 'Beginner'
      });

      setRecentActivity(activityRes.data?.activities || activityRes.activities || []);

      // Simple recommendations from adaptive learning
      const focusAreas = recRes.data?.focus_areas || recRes.focus_areas || [];
      if (focusAreas.length > 0) {
        setRecommendations(focusAreas.map((area: any, idx: number) => ({
          id: `rec-${idx}`,
          priority: area.priority || 'medium',
          type: 'topic',
          title: area.topic || 'Practice',
          description: `Focus on ${area.topic || 'this topic'} - ${area.recommended_questions || 10} questions recommended`,
          estimated_impact: 'Medium',
          time_required: '30 minutes'
        })));

        // Convert to insights format
        setInsights(focusAreas.slice(0, 3).map((area: any, idx: number) => ({
          id: `insight-${idx}`,
          type: area.priority === 'high' ? 'weakness' : 'opportunity',
          title: area.topic || 'Topic',
          description: `${area.recommended_questions || 10} questions recommended`,
          importance: area.priority === 'high' ? 0.9 : 0.5,
          actionable: true,
          recommendations: [`Practice ${area.recommended_questions || 10} questions on ${area.topic}`]
        })));
      }

      // Mock performance data
      setPerformanceData([
        { day: 'Mon', accuracy: 65, questions: 20 },
        { day: 'Tue', accuracy: 70, questions: 25 },
        { day: 'Wed', accuracy: 68, questions: 30 },
        { day: 'Thu', accuracy: 75, questions: 22 },
        { day: 'Fri', accuracy: 78, questions: 28 },
        { day: 'Sat', accuracy: 82, questions: 35 },
        { day: 'Sun', accuracy: 85, questions: 40 }
      ]);

      // Simulate user data
      setUser({
        full_name: 'Student',
        username: 'student',
        daily_goal_minutes: 30
      });
      console.log('[Dashboard] Data fetch successful');
    } catch (error) {
      console.error('[Dashboard] Failed to fetch dashboard data:', error);
      clearTimeout(loadingTimeout);
      // Set default values on error
      setStats({
        total_questions: 0,
        overall_accuracy: 0,
        current_streak: 0,
        questions_today: 0,
        total_study_time: 0,
        ability_level: 'Beginner'
      });
      setPerformanceData([
        { day: 'Mon', accuracy: 0, questions: 0 },
        { day: 'Tue', accuracy: 0, questions: 0 },
        { day: 'Wed', accuracy: 0, questions: 0 },
        { day: 'Thu', accuracy: 0, questions: 0 },
        { day: 'Fri', accuracy: 0, questions: 0 },
        { day: 'Sat', accuracy: 0, questions: 0 },
        { day: 'Sun', accuracy: 0, questions: 0 }
      ]);
      setUser({
        full_name: 'Student',
        username: 'student',
        daily_goal_minutes: 30
      });
    } finally {
      console.log('[Dashboard] Setting loading to false');
      setLoading(false);
    }
  }, [examType]);

  useEffect(() => {
    console.log('[Dashboard] useEffect triggered');
    fetchDashboardData();
  }, [fetchDashboardData]);

  interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    change?: number;
    color?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, color = 'indigo' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.full_name || user?.username}!
            </h1>
            <p className="text-indigo-100">
              You're on a {stats?.current_streak || 0} day streak! Keep up the great work!
            </p>
            <Link
              href="/test-prep/pricing"
              className="inline-block mt-4 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              🎯 View Prep Plans: Videos+Notes | QBank | Complete Bundle
            </Link>
          </div>
          <div className="text-right">
            <p className="text-sm text-indigo-100 mb-1">Current Level</p>
            <p className="text-2xl font-bold">
              {stats?.ability_level || 'Beginner'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Readiness Score</p>
            <p className="text-xl font-semibold mt-1">
              {readinessScore?.overall_score ? `${Math.round(readinessScore.overall_score * 100)}%` : 'N/A'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Questions Today</p>
            <p className="text-xl font-semibold mt-1">
              {stats?.questions_today || 0}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Overall Accuracy</p>
            <p className="text-xl font-semibold mt-1">
              {stats?.overall_accuracy ? `${Math.round(stats.overall_accuracy)}%` : '0%'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Predicted Score</p>
            <p className="text-xl font-semibold mt-1">
              {predictions?.exam_score?.expected || 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Exam Type Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="GRE">GRE</option>
          <option value="GMAT">GMAT</option>
          <option value="LSAT">LSAT</option>
          <option value="MCAT">MCAT</option>
          <option value="TOEFL">TOEFL</option>
          <option value="FE">FE Exam</option>
        </select>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/dashboard/test-prep/practice">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer"
          >
            <BookOpenIcon className="h-8 w-8 mb-3" />
            <h3 className="font-semibold">Adaptive Practice</h3>
            <p className="text-sm text-blue-100 mt-1">IRT-based questions</p>
          </motion.div>
        </Link>

        <Link href="/dashboard/test-prep/exam">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer"
          >
            <AcademicCapIcon className="h-8 w-8 mb-3" />
            <h3 className="font-semibold">Mock Exam</h3>
            <p className="text-sm text-green-100 mt-1">Full test simulation</p>
          </motion.div>
        </Link>

        <Link href="/dashboard/test-prep/analytics">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer"
          >
            <ChartBarIcon className="h-8 w-8 mb-3" />
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-purple-100 mt-1">Track progress</p>
          </motion.div>
        </Link>

        <Link href="/dashboard/test-prep/study-plan">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white cursor-pointer"
          >
            <CalendarIcon className="h-8 w-8 mb-3" />
            <h3 className="font-semibold">AI Study Plan</h3>
            <p className="text-sm text-orange-100 mt-1">Personalized schedule</p>
          </motion.div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={FireIcon}
          title="Current Streak"
          value={`${stats?.current_streak || 0} days`}
          change={10}
          color="orange"
        />
        <StatCard
          icon={TrophyIcon}
          title="Total Questions"
          value={stats?.total_questions || 0}
          change={15}
          color="yellow"
        />
        <StatCard
          icon={ClockIcon}
          title="Study Time"
          value={`${Math.round((stats?.total_study_time || 0) / 60)}h`}
          change={5}
          color="blue"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Overall Accuracy"
          value={`${stats?.overall_accuracy ? Math.round(stats.overall_accuracy) : 0}%`}
          change={3}
          color="green"
        />
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Performance Trends</h2>
          <span className="text-sm text-gray-600">Last 7 days</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
              name="Accuracy (%)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="questions"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              name="Questions"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <LightBulbIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">AI Insights</h2>
          </div>

          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'strength' ? 'bg-green-50 border-green-500' :
                  insight.type === 'weakness' ? 'bg-red-50 border-red-500' :
                  insight.type === 'opportunity' ? 'bg-blue-50 border-blue-500' :
                  'bg-gray-50 border-gray-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">{insight.title}</p>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      {insight.actionable && insight.recommendations.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          💡 {insight.recommendations[0]}
                        </p>
                      )}
                    </div>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      insight.importance >= 0.8 ? 'bg-red-100 text-red-700' :
                      insight.importance >= 0.5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {insight.importance >= 0.8 ? 'High' : insight.importance >= 0.5 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p className="text-sm">Complete more practice sessions to get AI-powered insights</p>
              </div>
            )}
          </div>

          <Link href="/dashboard/test-prep/analytics" className="block mt-4">
            <button className="w-full py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium">
              View All Insights
            </button>
          </Link>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">AI Recommendations</h2>
          </div>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>⏱️ {rec.time_required}</span>
                    <span>📈 {rec.estimated_impact}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p className="text-sm">Complete practice sessions to get personalized recommendations</p>
              </div>
            )}
          </div>

          <Link href="/dashboard/test-prep/study-plan" className="block mt-4">
            <button className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
              View Full Study Plan
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>

        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{activity.details}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>

        <Link href="/dashboard/test-prep/analytics" className="block mt-4">
          <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            View All Activity
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
