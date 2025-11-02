import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { projectAPI } from '../utils/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

export default function Projects() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchProjects();
    }
  }, [authLoading, isAuthenticated, router, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await projectAPI.getAll(params);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectAPI.delete(id);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
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
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
          </div>
          <Link href="/projects/new">
            <button className="btn btn-primary flex items-center gap-2">
              <FiPlus size={20} />
              New Project
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Projects
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No projects found</p>
            <Link href="/projects/new">
              <button className="mt-4 btn btn-primary">
                Create Your First Project
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      by {project.owner_name}
                    </p>
                  </div>
                  <span className={`badge ${
                    project.status === 'active' ? 'badge-success' :
                    project.status === 'completed' ? 'badge-primary' :
                    'badge-warning'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">{project.task_count}</span> tasks
                  </div>
                  {project.budget && (
                    <div>
                      <span className="font-medium">${project.budget}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <Link href={`/projects/${project.id}`} className="flex-1">
                    <button className="w-full btn btn-secondary text-sm flex items-center justify-center gap-2">
                      <FiEye size={16} />
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => router.push(`/projects/${project.id}/edit`)}
                    className="btn btn-secondary text-sm p-2"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="btn btn-danger text-sm p-2"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
