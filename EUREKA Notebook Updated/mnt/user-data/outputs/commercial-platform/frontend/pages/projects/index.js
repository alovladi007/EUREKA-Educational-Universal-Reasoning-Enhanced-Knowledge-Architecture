import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { projectAPI } from '../../utils/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';

export default function Projects() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchProjects();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll({});
      setProjects(response.data.projects);
    } catch (error) {
      toast.error('Failed to load projects');
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your projects</p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No projects found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  {project.description || 'No description'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="badge badge-primary">{project.status}</span>
                  <span className="text-sm text-gray-600">
                    {project.task_count} tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
