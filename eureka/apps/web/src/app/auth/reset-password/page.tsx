'use client';

/**
 * Password reset landing (WS4 GTM) — the target of the link in the reset
 * email: /auth/reset-password?token=…
 *
 * Collects the new password and posts {token, new_password} to
 * /auth/password-reset/confirm. Completes the forgot-password flow started
 * on /auth/forgot-password.
 */

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, KeyRound, Loader2 } from 'lucide-react';

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

function ResetPasswordInner() {
  const token = useSearchParams()?.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) setDone(true);
      else setError(typeof body?.detail === 'string' ? body.detail : 'Reset failed — the link may have expired.');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="mt-4 text-2xl font-bold">Password updated</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Log in with your new password.
            </p>
            <Link href="/auth/login"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
              Go to login
            </Link>
          </div>
        ) : !token ? (
          <div className="text-center">
            <KeyRound className="mx-auto h-10 w-10 text-indigo-600" />
            <h1 className="mt-4 text-2xl font-bold">Missing reset link</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Open the link from your reset email, or request a new one.
            </p>
            <Link href="/auth/forgot-password" className="mt-4 inline-block text-sm text-indigo-600 underline">
              Request a reset link
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <KeyRound className="mx-auto h-10 w-10 text-indigo-600" />
              <h1 className="mt-4 text-2xl font-bold">Choose a new password</h1>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">New password</label>
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm password</label>
                <input
                  type="password" required value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Repeat the password"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Set new password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
