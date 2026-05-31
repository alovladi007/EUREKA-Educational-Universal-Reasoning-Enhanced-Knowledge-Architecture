'use client';

/**
 * Forgot-password request page (P1.5).
 *
 * The login page's "Forgot your password?" link was a dead `href="#"`.
 * It now routes here. This posts the email to api-core's real
 * `/auth/password-reset` endpoint (body `{ email }`), which mints a
 * reset token and emails it (or no-ops + logs if SMTP is unconfigured).
 *
 * For security the API always returns 200 regardless of whether the
 * email exists, so this page always shows the same "check your inbox"
 * confirmation — it never reveals account existence.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Enter your email address');
      return;
    }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';
      await fetch(`${apiUrl}${apiPrefix}/auth/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success — the API is intentionally non-revealing.
      setSent(true);
    } catch {
      // Even on a network error we don't leak; show the same state but
      // surface a soft toast so the user knows to retry if truly offline.
      toast('If the service is reachable, a reset link is on its way.', { icon: 'ℹ️' });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">
            {sent
              ? "If an account exists for that address, we've sent a reset link. Check your inbox (and spam)."
              : 'Enter your account email and we’ll send a reset link.'}
          </p>
        </div>

        {!sent ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <button
            onClick={() => { setSent(false); setEmail(''); }}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Send another link
          </button>
        )}

        <div className="text-center">
          <Link href="/auth/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            ← Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
