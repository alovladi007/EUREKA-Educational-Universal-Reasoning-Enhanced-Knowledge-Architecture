'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  // Wrap the body so useSearchParams() is inside a Suspense boundary
  // (required by Next 14 static prerender — see /docs/messages/missing-suspense-with-csr-bailout).
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <LoginPageBody />
    </Suspense>
  );
}

// Demo credentials shown on the login page for convenience. Shown in dev
// builds, or when NEXT_PUBLIC_SHOW_DEMO_LOGIN=true is baked in at build time.
// The flag defaults to OFF, so a real production deployment (which doesn't set
// it) never renders these — the local compose opts in explicitly. Both checks
// are inlined and dead-code-eliminated by Next.js when false.
const DEMO_EMAIL = 'you@eureka.example.com';
const DEMO_PASSWORD = 'EurekaAdmin!2026';
const SHOW_DEMO_CREDENTIALS =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === 'true';

function LoginPageBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get('next') || null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Real auth against api-core (Phase 3.3 + 13.5)
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiPrefix =
        process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';
      const res = await fetch(`${apiUrl}${apiPrefix}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail =
          typeof body.detail === 'string'
            ? body.detail
            : Array.isArray(body.detail)
              ? body.detail.map((d: { msg?: string }) => d.msg).join(', ')
              : `HTTP ${res.status}`;
        toast.error(`Login failed: ${detail}`);
        return;
      }
      if (!body.access_token) {
        toast.error('Login response missing token');
        return;
      }
      // The new Phase 9-14 pages read this key (lib/eureka-api.ts).
      window.localStorage.setItem('access_token', body.access_token);
      if (body.refresh_token) {
        window.localStorage.setItem('refresh_token', body.refresh_token);
      }
      toast.success('Login successful!');
      // Respect ?next= if provided (the api wrapper redirects here on 401),
      // otherwise send admins to /admin, learners to /learner.
      if (next && next.startsWith('/')) {
        router.push(next);
        return;
      }
      const role = body.user?.role || body.role;
      if (role === 'org_admin' || role === 'super_admin') {
        router.push('/admin');
      } else {
        router.push('/learner');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">Sign in to continue your learning journey</p>
        </div>

        {SHOW_DEMO_CREDENTIALS && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-800">Demo login</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({ username: DEMO_EMAIL, password: DEMO_PASSWORD })
                }
                className="rounded-md bg-amber-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Use these credentials
              </button>
            </div>
            <dl className="mt-2 space-y-1 text-amber-900">
              <div className="flex justify-between gap-2">
                <dt className="text-amber-700">Email</dt>
                <dd className="font-mono">{DEMO_EMAIL}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-amber-700">Password</dt>
                <dd className="font-mono">{DEMO_PASSWORD}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-amber-700">
              Local convenience — a real deployment omits the opt-in flag, so
              this box does not ship.
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="username"
                name="username"
                type="email"
                autoComplete="email"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
