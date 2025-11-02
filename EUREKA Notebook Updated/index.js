import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Commercial Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            All-in-one platform for managing projects, tasks, payments, and collaboration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-300">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Task Management
            </h3>
            <p className="text-gray-600">
              Create, assign, and track tasks with ease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Processing
            </h3>
            <p className="text-gray-600">
              Secure payment integration with Stripe.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-600">
              Stay connected with live updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
