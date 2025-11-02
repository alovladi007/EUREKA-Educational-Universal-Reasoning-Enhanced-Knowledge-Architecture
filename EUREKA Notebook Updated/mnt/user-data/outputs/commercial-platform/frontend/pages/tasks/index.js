import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { taskAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Tasks() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchTasks();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll({});
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
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

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your tasks</p>
        </div>

        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      {task.description || 'No description'}
                    </p>
                    <div className="flex gap-2">
                      <span className="badge badge-primary">{task.status}</span>
                      <span className="badge badge-warning">{task.priority}</span>
                    </div>
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
