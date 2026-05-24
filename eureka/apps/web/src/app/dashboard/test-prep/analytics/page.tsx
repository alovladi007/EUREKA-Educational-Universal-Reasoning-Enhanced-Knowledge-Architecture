'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import {
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api-client';
import { useActiveExam } from '@/hooks/use-active-exam';
import { ExamSelector } from '@/components/test-prep/ExamSelector';

interface Stats {
  total_questions: number;
  overall_accuracy: number;
  current_streak: number;
  questions_today: number;
  total_study_time: number;
  ability_level: string;
}

export default function AnalyticsPage() {
  const { examType, examConfig } = useActiveExam();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [comprehensiveData, setComprehensiveData] = useState<any>(null);
  const [readinessScore, setReadinessScore] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [peerComparison, setPeerComparison] = useState<any>(null);
  const [topicMastery, setTopicMastery] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [examType]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        comprehensiveRes,
        readinessRes,
        insightsRes,
        predictionsRes,
        trendsRes,
        peerRes,
        topicMasteryRes,
        performanceTrendsRes
      ] = await Promise.all([
        apiClient.getAnalyticsUserStats(),
        apiClient.getComprehensiveAnalytics(examType),
        apiClient.getReadinessScore(),
        apiClient.getInsights(examType),
        apiClient.getPredictions(examType),
        apiClient.getTrends(examType),
        apiClient.getPeerComparison(examType),
        apiClient.getTopicMastery(examType),
        apiClient.getPerformanceTrends(30)
      ]);

      setStats(statsRes);
      setComprehensiveData(comprehensiveRes);
      setReadinessScore(readinessRes);
      setInsights(insightsRes.insights || []);
      setPredictions(predictionsRes);
      setTrends(trendsRes);
      setPeerComparison(peerRes);
      setTopicMastery(topicMasteryRes.topics || []);

      // Format performance data for charts
      if (performanceTrendsRes.trends && performanceTrendsRes.trends.length > 0) {
        setPerformanceData(performanceTrendsRes.trends.map((trend: any) => ({
          date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          accuracy: trend.accuracy,
          questions: trend.questions
        })));
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set defaults
      setStats({
        total_questions: 0,
        overall_accuracy: 0,
        current_streak: 0,
        questions_today: 0,
        total_study_time: 0,
        ability_level: 'Beginner'
      });
    } finally {
      setLoading(false);
    }
  };

  interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    subValue: string;
    color?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, subValue, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-8 w-8 text-${color}-600`} />
        <span className={`text-sm font-medium text-${color}-600 bg-${color}-50 px-2 py-1 rounded`}>
          {subValue}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Prepare readiness breakdown data for pie chart
  const readinessBreakdown = readinessScore?.breakdown ? [
    { name: 'Content Mastery', value: readinessScore.breakdown.content_mastery * 100, color: '#6366f1' },
    { name: 'Consistency', value: readinessScore.breakdown.consistency * 100, color: '#10b981' },
    { name: 'Time Management', value: readinessScore.breakdown.time_management * 100, color: '#f59e0b' },
    { name: 'Accuracy', value: readinessScore.breakdown.accuracy * 100, color: '#ef4444' },
    { name: 'Difficulty Handling', value: readinessScore.breakdown.difficulty_handling * 100, color: '#8b5cf6' }
  ] : [];

  // Prepare topic mastery for radar chart
  const topicRadarData = topicMastery.slice(0, 6).map(topic => ({
    topic: topic.topic.length > 15 ? topic.topic.substring(0, 15) + '...' : topic.topic,
    mastery: topic.mastery,
    accuracy: topic.accuracy
  }));

  return (
    <div className="space-y-6">
      {/* Exam selector + workspace deep link */}
      <ExamSelector variant="card" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold mb-2">{examConfig.shortName} Analytics</h1>
            <p className="text-purple-100">Advanced insights powered by AI and psychometric models · {examConfig.sections.length} sections · {examConfig.totalQuestions} questions · {Math.floor(examConfig.totalDuration / 60)}h {examConfig.totalDuration % 60}m</p>
          </div>
          <div className="text-right text-xs text-purple-100/80">
            <p className="font-mono">{examConfig.scoreRange.label}</p>
            {examConfig.passingInfo && <p className="mt-1 max-w-xs">{examConfig.passingInfo}</p>}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          icon={TrophyIcon}
          label="Readiness Score"
          value={readinessScore?.overall_score ? `${Math.round(readinessScore.overall_score * 100)}%` : 'N/A'}
          subValue={readinessScore?.interpretation || 'Calculating...'}
          color="purple"
        />
        <StatCard
          icon={ChartBarIcon}
          label="Overall Accuracy"
          value={stats?.overall_accuracy ? `${Math.round(stats.overall_accuracy)}%` : '0%'}
          subValue={trends?.overall?.direction === 'up' ? '↑ Improving' : trends?.overall?.direction === 'down' ? '↓ Declining' : '→ Stable'}
          color="green"
        />
        <StatCard
          icon={FireIcon}
          label="Current Streak"
          value={`${stats?.current_streak || 0} days`}
          subValue="Keep it up!"
          color="orange"
        />
        <StatCard
          icon={ClockIcon}
          label="Study Time"
          value={`${Math.round((stats?.total_study_time || 0) / 60)}h`}
          subValue="Total"
          color="blue"
        />
        <StatCard
          icon={AcademicCapIcon}
          label="Questions Solved"
          value={stats?.total_questions || 0}
          subValue={`${stats?.questions_today || 0} today`}
          color="indigo"
        />
      </div>

      {/* Predictions Section */}
      {predictions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-100"
        >
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">AI Predictions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Predicted Exam Score</p>
              <p className="text-2xl font-bold text-indigo-600">
                {predictions.exam_score?.expected || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Range: {predictions.exam_score?.range?.[0]} - {predictions.exam_score?.range?.[1]}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Readiness Date</p>
              <p className="text-lg font-bold text-green-600">
                {predictions.readiness_date ? new Date(predictions.readiness_date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Est. {predictions.readiness_date ? Math.ceil((new Date(predictions.readiness_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0} days
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Success Probability</p>
              <p className="text-2xl font-bold text-purple-600">
                {predictions.success_probability ? `${Math.round(predictions.success_probability * 100)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Reaching target score</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Target Probability</p>
              <p className="text-2xl font-bold text-orange-600">
                {predictions.probability_of_target ? `${Math.round(predictions.probability_of_target * 100)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on current pace</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Row 1 - Performance Trend & Readiness Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Trend (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorAccuracy)"
                name="Accuracy %"
              />
            </AreaChart>
          </ResponsiveContainer>
          {trends?.overall && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Trend:</span> {trends.overall.interpretation}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(trends.overall.confidence * 100)}%
              </p>
            </div>
          )}
        </motion.div>

        {/* Readiness Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Readiness Breakdown</h2>
          {readinessBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={readinessBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {readinessBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {readinessBreakdown.map((entry, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-gray-700">{entry.name}: {entry.value.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-20">No readiness data available yet</p>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 - Topic Mastery & Peer Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Performance Radar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Topic Mastery Radar</h2>
          {topicRadarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={topicRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Mastery"
                  dataKey="mastery"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Accuracy"
                  dataKey="accuracy"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No topic data available yet</p>
          )}
        </motion.div>

        {/* Peer Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Peer Comparison</h2>
          </div>
          {peerComparison ? (
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Your Percentile Rank</p>
                <div className="flex items-end">
                  <p className="text-4xl font-bold text-indigo-600">
                    {Math.round(peerComparison.percentile_rank)}
                  </p>
                  <p className="text-lg text-gray-600 ml-1 mb-1">%</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">{peerComparison.interpretation}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Peer Group Size</p>
                  <p className="text-lg font-bold text-gray-900">{peerComparison.peer_group_size || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Avg Score</p>
                  <p className="text-lg font-bold text-gray-900">{peerComparison.average_score || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700 mb-2">Your Strengths vs Peers:</p>
                <div className="space-y-1">
                  {peerComparison.strengths?.slice(0, 3).map((strength: string, i: number) => (
                    <div key={i} className="text-xs text-gray-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-700 mb-2">Areas to Improve:</p>
                <div className="space-y-1">
                  {peerComparison.weaknesses?.slice(0, 3).map((weakness: string, i: number) => (
                    <div key={i} className="text-xs text-gray-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      {weakness}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-20">No peer comparison data available</p>
          )}
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <LightBulbIcon className="h-6 w-6 text-yellow-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Insights</h2>
        </div>

        {insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.slice(0, 6).map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'strength' ? 'bg-green-50 border-green-500' :
                insight.type === 'weakness' ? 'bg-red-50 border-red-500' :
                insight.type === 'opportunity' ? 'bg-blue-50 border-blue-500' :
                insight.type === 'pattern' ? 'bg-purple-50 border-purple-500' :
                'bg-gray-50 border-gray-500'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    insight.importance >= 0.8 ? 'bg-red-100 text-red-700' :
                    insight.importance >= 0.5 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {insight.importance >= 0.8 ? 'High' : insight.importance >= 0.5 ? 'Med' : 'Low'}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{insight.description}</p>
                {insight.actionable && insight.recommendations.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2 italic">
                    💡 {insight.recommendations[0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p className="text-sm">Complete more practice sessions to unlock AI insights</p>
          </div>
        )}
      </motion.div>

      {/* Risk Factors */}
      {predictions?.risk_factors && predictions.risk_factors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Risk Factors & Mitigation</h2>
          </div>
          <div className="space-y-3">
            {predictions.risk_factors.map((risk: any, index: number) => (
              <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-900">{risk.type}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    risk.severity === 'high' ? 'bg-red-100 text-red-700' :
                    risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">Impact: {risk.impact}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Mitigation:</span> {risk.mitigation}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Topic Mastery Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Topic Mastery</h2>
        {topicMastery.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Topic</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Questions</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Accuracy</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Avg Time</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Mastery</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Trend</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {topicMastery.map((topic, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{topic.topic}</td>
                    <td className="py-3 px-4 text-sm text-center">{topic.questions_answered}</td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className={`font-medium ${
                        topic.accuracy > 70 ? 'text-green-600' :
                        topic.accuracy > 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {topic.accuracy.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-gray-600">
                      {topic.avg_time.toFixed(0)}s
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${topic.mastery}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{topic.mastery.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        topic.trend === 'improving' ? 'bg-green-100 text-green-700' :
                        topic.trend === 'declining' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {topic.trend === 'improving' ? '↑' : topic.trend === 'declining' ? '↓' : '→'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        topic.status === 'Mastered' ? 'bg-green-100 text-green-700' :
                        topic.status === 'Proficient' ? 'bg-blue-100 text-blue-700' :
                        topic.status === 'Developing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {topic.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No topic data available yet. Start practicing to build your profile!</p>
        )}
      </motion.div>

      {/* Exam Blueprint — exam-specific section breakdown from EXAM_CONFIGS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{examConfig.shortName} Exam Blueprint</h2>
            <p className="text-sm text-gray-500">
              Official section breakdown — your readiness should be tracked against THIS exact distribution.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">{examConfig.totalQuestions}</p>
            <p className="text-xs text-gray-500">total questions</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Section</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Questions</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">Time</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">% of exam</th>
              </tr>
            </thead>
            <tbody>
              {examConfig.sections.map((s) => (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-gray-900">{s.name}</td>
                  <td className="py-2 px-3 text-center text-gray-600">{s.questionCount ?? '—'}</td>
                  <td className="py-2 px-3 text-center text-gray-600">
                    {s.timeMinutes ? `${s.timeMinutes} min` : '—'}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {s.questionCount
                      ? `${((s.questionCount / examConfig.totalQuestions) * 100).toFixed(1)}%`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Score range: <span className="font-mono">{examConfig.scoreRange.label}</span>
          {examConfig.passingInfo ? ` · ${examConfig.passingInfo}` : ''}
        </p>
      </motion.div>
    </div>
  );
}
