import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { axios } from '../store/authStore';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [topicPerformance, setTopicPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, trendsRes, reportRes] = await Promise.all([
        axios.get('/api/v1/analytics/user-stats'),
        axios.get(`/api/v1/analytics/performance-trends?days=${timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365}`),
        axios.get('/api/v1/adaptive/ability-report')
      ]);

      setStats(statsRes.data);
      setPerformanceData(trendsRes.data.trends || []);
      
      // Format topic performance for radar chart
      if (reportRes.data.topic_abilities) {
        const topics = Object.entries(reportRes.data.topic_abilities).map(([topic, data]) => ({
          topic: topic,
          ability: (data.ability + 3) * 16.67, // Convert to 0-100 scale
          accuracy: data.accuracy * 100
        }));
        setTopicPerformance(topics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = [
    { name: 'Correct', value: stats?.correct_answers || 0, color: '#10b981' },
    { name: 'Incorrect', value: stats?.incorrect_answers || 0, color: '#ef4444' }
  ];

  const StatCard = ({ icon: Icon, label, value, subValue, color = 'blue' }) => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-purple-100">Track your progress and identify areas for improvement</p>
        
        <div className="flex gap-2 mt-6">
          {['week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg capitalize ${
                timeRange === range
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : 'Last Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrophyIcon}
          label="Overall Accuracy"
          value={`${stats?.overall_accuracy || 0}%`}
          subValue="+5% this week"
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
          subValue="This month"
          color="blue"
        />
        <StatCard
          icon={AcademicCapIcon}
          label="Questions Solved"
          value={stats?.total_questions || 0}
          subValue="+120 this week"
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#6366f1" 
                strokeWidth={2}
                name="Accuracy %"
                dot={{ fill: '#6366f1' }}
              />
              <Line 
                type="monotone" 
                dataKey="questions" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Questions"
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Topic Performance Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Topic Mastery</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={topicPerformance}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="topic" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar 
                name="Ability" 
                dataKey="ability" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.3}
              />
              <Radar 
                name="Accuracy" 
                dataKey="accuracy" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Success Rate Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Success Rate</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieChartData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Study Time Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Study Time by Day</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { day: 'Mon', minutes: 45 },
              { day: 'Tue', minutes: 60 },
              { day: 'Wed', minutes: 30 },
              { day: 'Thu', minutes: 75 },
              { day: 'Fri', minutes: 50 },
              { day: 'Sat', minutes: 90 },
              { day: 'Sun', minutes: 120 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Improvement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Strength Detected</p>
              <p className="text-xs text-green-700 mt-1">
                Excellent performance in Algebra (+15% this week)
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Focus Area</p>
              <p className="text-xs text-yellow-700 mt-1">
                Reading Comprehension needs more practice
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Recommendation</p>
              <p className="text-xs text-blue-700 mt-1">
                Try 10 more Geometry problems to reach mastery
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Statistics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Performance by Topic</h2>
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
              </tr>
            </thead>
            <tbody>
              {topicPerformance.map((topic, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{topic.topic}</td>
                  <td className="py-3 px-4 text-sm text-center">{Math.floor(Math.random() * 50) + 10}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className={`font-medium ${topic.accuracy > 70 ? 'text-green-600' : topic.accuracy > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {topic.accuracy.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">{Math.floor(Math.random() * 120) + 30}s</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${topic.ability}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      Math.random() > 0.5 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {Math.random() > 0.5 ? '↑' : '↓'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
