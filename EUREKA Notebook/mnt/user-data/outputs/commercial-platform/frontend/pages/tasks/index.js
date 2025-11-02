import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { taskAPI } from '../utils/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';

export default function Tasks() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchTasks();
    }
  }, [authLoading, isAuthenticated, router, searchTerm, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const response = await taskAPI.getAll(params);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.delete(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and track your tasks</p>
          </div>
          <Link href="/tasks/new">
            <button className="btn btn-primary flex items-center gap-2">
              <FiPlus size={20} />
              New Task
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tasks
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No tasks found</p>
            <Link href="/tasks/new">
              <button className="mt-4 btn btn-primary">
                Create Your First Task
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/tasks/${task.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {task.title}
                        </h3>
                      </Link>
                      <span className={`badge status-${task.status}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {task.description || 'No description'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Project:</span> {task.project_name}
                      </div>
                      {task.assigned_to_name && (
                        <div>
                          <span className="font-medium">Assigned to:</span> {task.assigned_to_name}
                        </div>
                      )}
                      {task.due_date && (
                        <div>
                          <span className="font-medium">Due:</span>{' '}
                          {format(new Date(task.due_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{task.comment_count}</span> comments
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="input text-sm px-2 py-1"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>

                    <Link href={`/tasks/${task.id}`}>
                      <button className="btn btn-secondary text-sm p-2">
                        <FiEye size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => router.push(`/tasks/${task.id}/edit`)}
                      className="btn btn-secondary text-sm p-2"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn btn-danger text-sm p-2"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
