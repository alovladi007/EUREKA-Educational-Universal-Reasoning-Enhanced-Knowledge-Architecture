'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { notebookAPI } from '@/lib/notebook/api-client';
import { notebookSocket } from '@/lib/notebook/socket-client';
import { useAuthStore } from '@/stores/auth';
import {
  FolderKanban,
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived' | 'on_hold';
  start_date?: string;
  end_date?: string;
  created_at: string;
}

interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
}

interface Stats {
  projects: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
  };
  tasks: {
    total_tasks: number;
    todo_tasks: number;
    in_progress_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
  };
}

export default function NotebookPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({
    projects: {
      total_projects: 0,
      active_projects: 0,
      completed_projects: 0,
    },
    tasks: {
      total_tasks: 0,
      todo_tasks: 0,
      in_progress_tasks: 0,
      completed_tasks: 0,
      overdue_tasks: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotebookData();

    // Connect WebSocket for real-time updates
    const token = localStorage.getItem('token');
    if (token) {
      notebookSocket.connect(token);

      // Listen for real-time updates
      notebookSocket.onTaskUpdated(() => {
        loadNotebookData();
      });

      notebookSocket.onNotificationReceived(() => {
        loadNotebookData();
      });
    }

    return () => {
      notebookSocket.disconnect();
    };
  }, [user]);

  const loadNotebookData = async () => {
    try {
      setLoading(true);

      // Load dashboard stats
      const statsResponse = await notebookAPI.dashboard.getStats();
      setStats(statsResponse.data);

      // Load projects
      const projectsResponse = await notebookAPI.projects.getAll();
      const projectsData = projectsResponse.data.projects || [];
      setProjects(projectsData.slice(0, 6)); // Show only 6 projects

      // Load recent tasks
      const tasksResponse = await notebookAPI.tasks.getAll();
      const tasksData = tasksResponse.data.tasks || [];
      setTasks(tasksData.slice(0, 10)); // Show only recent 10 tasks
    } catch (error) {
      console.error('Failed to load notebook data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      blocked: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notebook</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your projects and tasks
          </p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={() => router.push('/dashboard/notebook/projects')}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderKanban className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Projects
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.projects.active_projects}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">
                    of {stats.projects.total_projects}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Tasks Completed
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.tasks.completed_tasks}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">
                    of {stats.tasks.total_tasks}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  In Progress
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.tasks.in_progress_tasks}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">tasks</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Overdue
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.tasks.overdue_tasks}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">tasks</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects & Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            <button
              className="text-sm text-primary-600 hover:text-primary-700"
              onClick={() => router.push('/dashboard/notebook/projects')}
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No projects yet</p>
                <button
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                  onClick={() => router.push('/dashboard/notebook/projects')}
                >
                  Create your first project
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
                  onClick={() =>
                    router.push(`/dashboard/notebook/projects/${project.id}`)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            <button
              className="text-sm text-primary-600 hover:text-primary-700"
              onClick={() => router.push('/dashboard/notebook/tasks')}
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No tasks yet</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
                  onClick={() =>
                    router.push(`/dashboard/notebook/tasks/${task.id}`)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            onClick={() => router.push('/dashboard/notebook/projects')}
          >
            <Plus className="h-5 w-5 mr-2 text-primary-600" />
            <span className="text-sm font-medium">New Project</span>
          </button>
          <button
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            onClick={() => router.push('/dashboard/notebook/tasks')}
          >
            <CheckSquare className="h-5 w-5 mr-2 text-primary-600" />
            <span className="text-sm font-medium">New Task</span>
          </button>
          <button
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            onClick={() => router.push('/dashboard/notebook/projects')}
          >
            <FileText className="h-5 w-5 mr-2 text-primary-600" />
            <span className="text-sm font-medium">Upload File</span>
          </button>
          <button
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            onClick={() => router.push('/dashboard/notebook/search')}
          >
            <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
            <span className="text-sm font-medium">Search</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
