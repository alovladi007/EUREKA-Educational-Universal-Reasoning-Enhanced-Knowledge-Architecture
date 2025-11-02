import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { dashboardAPI } from '../utils/api';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  FiFolder,
  FiCheckSquare,
  FiAlertCircle,
  FiTrendingUp
} from 'react-icons/fi';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects and tasks
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.projects?.total_projects || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiFolder className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {stats?.projects?.active_projects || 0} active
              </span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-gray-600">
                {stats?.projects?.completed_projects || 0} completed
              </span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.tasks?.total_tasks || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckSquare className="text-green-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-yellow-600 font-medium">
                {stats?.tasks?.in_progress_tasks || 0} in progress
              </span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.tasks?.completed_tasks || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {stats?.tasks?.todo_tasks || 0} tasks remaining
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.overdueTasks || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiAlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <div className="mt-4 text-sm text-red-600">
              Needs attention
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              <Link href="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.upcomingTasks && stats.upcomingTasks.length > 0 ? (
                stats.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <Link href={`/tasks/${task.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer truncate">
                          {task.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-600 mt-1">
                        {task.project_name}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`badge ${
                        task.priority === 'urgent' ? 'badge-danger' :
                        task.priority === 'high' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {task.priority}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'No due date'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user_name}</span>
                        {' '}
                        <span className="text-gray-600">
                          {activity.action.replace(/_/g, ' ')}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/projects/new">
              <button className="w-full btn btn-primary">
                Create Project
              </button>
            </Link>
            <Link href="/tasks/new">
              <button className="w-full btn btn-secondary">
                Add Task
              </button>
            </Link>
            <Link href="/search">
              <button className="w-full btn btn-secondary">
                Search
              </button>
            </Link>
            <Link href="/payments">
              <button className="w-full btn btn-secondary">
                View Payments
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
