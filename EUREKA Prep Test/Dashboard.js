import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  SparklesIcon
} from '@heroicons/react/24/outline';
import { axios, useAuthStore } from '../store/authStore';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes, recRes] = await Promise.all([
        axios.get('/analytics/user-stats'),
        axios.get('/analytics/recent-activity'),
        axios.get('/adaptive/learning-path?exam_type=GRE')
      ]);
      
      setStats(statsRes.data);
      setRecentActivity(activityRes.data.activities || []);
      setRecommendations(recRes.data.focus_areas || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock performance data for chart
  const performanceData = [
    { day: 'Mon', accuracy: 65, questions: 20 },
    { day: 'Tue', accuracy: 70, questions: 25 },
    { day: 'Wed', accuracy: 68, questions: 30 },
    { day: 'Thu', accuracy: 75, questions: 22 },
    { day: 'Fri', accuracy: 78, questions: 28 },
    { day: 'Sat', accuracy: 82, questions: 35 },
    { day: 'Sun', accuracy: 85, questions: 40 }
  ];

  const StatCard = ({ icon: Icon, title, value, change, color = 'indigo' }) => (
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
              Welcome back, {user?.full_name || user?.username}! 👋
            </h1>
            <p className="text-indigo-100">
              You're on a {stats?.current_streak || 0} day streak! Keep up the great work!
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-indigo-100 mb-1">Current Level</p>
            <p className="text-2xl font-bold">
              {stats?.ability_level || 'Beginner'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Today's Goal</p>
            <p className="text-xl font-semibold mt-1">
              {stats?.daily_goal_progress || 0}/{user?.daily_goal_minutes || 30} min
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Questions Today</p>
            <p className="text-xl font-semibold mt-1">
              {stats?.questions_today || 0}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Accuracy Today</p>
            <p className="text-xl font-semibold mt-1">
              {stats?.accuracy_today || 0}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/practice">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer"
          >
            <BookOpenIcon className="h-8 w-8 mb-3" />
            <h3 className="font-semibold">Practice Mode</h3>
            <p className="text-sm text-blue-100 mt-1">Adaptive questions</p>
          </motion.div>
        </Link>

        <Link to="/exam">
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

        <Link to="/analytics">
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

        <Link to="/study-plan">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white cursor-pointer"
          >
            <CalendarIcon className="h-8 w-8 mb-3" />
            <h3 className="font-semibold">Study Plan</h3>
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
          title="Total Points"
          value={stats?.total_points || 0}
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
          value={`${stats?.overall_accuracy || 0}%`}
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
          <h2 className="text-xl font-bold text-gray-800">This Week's Performance</h2>
          <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="questions"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">AI Recommendations</h2>
          </div>
          
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{rec.topic}</p>
                  <p className="text-sm text-gray-600">
                    Focus on {rec.priority} priority topics
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {rec.recommended_questions} questions
                </span>
              </div>
            ))}
          </div>
          
          <Link to="/study-plan" className="block mt-4">
            <button className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
              View Full Study Plan
            </button>
          </Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <span className="text-sm text-gray-600">{activity.details}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
          
          <Link to="/analytics" className="block mt-4">
            <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              View All Activity
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
