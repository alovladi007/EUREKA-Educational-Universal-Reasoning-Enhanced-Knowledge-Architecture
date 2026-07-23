'use client';

/**
 * Email verification landing (WS4 GTM) — the target of the link in the
 * verification email: /auth/verify-email?token=…
 *
 * Posts the token to /auth/verify-email and shows a plain success/failure
 * state. On an expired/invalid token, a logged-in user can request a fresh
 * link via /auth/resend-verification.
 */

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, MailCheck } from 'lucide-react';

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

function VerifyEmailInner() {
  const token = useSearchParams()?.get('token') ?? '';
  const [state, setState] = useState<'working' | 'ok' | 'fail' | 'no-token'>('working');
  const [detail, setDetail] = useState('');
  const [resent, setResent] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setState('no-token'); return; }
    (async () => {
      try {
        const res = await fetch(`${API}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok) setState('ok');
        else { setState('fail'); setDetail(typeof body?.detail === 'string' ? body.detail : 'Verification failed.'); }
      } catch {
        setState('fail'); setDetail('Could not reach the server.');
      }
    })();
  }, [token]);

  const resend = async () => {
    const access = localStorage.getItem('access_token');
    if (!access) { setResent('Log in first, then request a new link.'); return; }
    try {
      const res = await fetch(`${API}/auth/resend-verification`, {
        method: 'POST', headers: { Authorization: `Bearer ${access}` },
      });
      const body = await res.json().catch(() => ({}));
      setResent(typeof body?.message === 'string' ? body.message : 'Requested a new link.');
    } catch {
      setResent('Could not reach the server.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-slate-900">
        {state === 'working' && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />
            <p className="mt-4 text-slate-600 dark:text-slate-300">Verifying your email…</p>
          </>
        )}
        {state === 'ok' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="mt-4 text-2xl font-bold">Email verified</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your account is confirmed. You&apos;re all set.
            </p>
            <Link href="/dashboard/test-prep"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
              Go to your dashboard
            </Link>
          </>
        )}
        {(state === 'fail' || state === 'no-token') && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold">
              {state === 'no-token' ? 'Missing verification link' : 'Verification failed'}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {state === 'no-token'
                ? 'Open the link from your verification email — it contains a one-time token.'
                : `${detail} Links expire after 24 hours.`}
            </p>
            <button onClick={resend}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-indigo-600 px-5 py-2.5 font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950">
              <MailCheck className="h-4 w-4" /> Send me a new link
            </button>
            {resent && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{resent}</p>}
            <p className="mt-4 text-xs text-slate-400">
              <Link href="/auth/login" className="underline">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VerifyEmailInner />
    </Suspense>
  );
}
