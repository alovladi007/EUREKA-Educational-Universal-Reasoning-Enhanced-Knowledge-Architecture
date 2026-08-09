'use client';

// /launch/[vertical] — same-tab launcher for the platform verticals that run
// as their own apps (AXIOM = mathematics on :4100, OCTET = chemistry on
// :4200). Mirrors the dashboard sidebar's token handoff: the current EUREKA
// JWT rides the URL hash (client-only, stripped on arrival) so the user
// lands signed in. Marketing pages link here so "Master mathematics" opens
// the actual mathematics app, not a generic dashboard.

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ROOTS: Record<string, { root: string; label: string }> = {
  mathematics: { root: process.env.NEXT_PUBLIC_AXIOM_WEB_URL || 'http://localhost:4100', label: 'Mathematics (AXIOM)' },
  axiom: { root: process.env.NEXT_PUBLIC_AXIOM_WEB_URL || 'http://localhost:4100', label: 'Mathematics (AXIOM)' },
  chemistry: { root: process.env.NEXT_PUBLIC_OCTET_WEB_URL || 'http://localhost:4200', label: 'Chemistry (OCTET)' },
  octet: { root: process.env.NEXT_PUBLIC_OCTET_WEB_URL || 'http://localhost:4200', label: 'Chemistry (OCTET)' },
};

export default function LaunchVerticalPage() {
  const params = useParams<{ vertical: string }>();
  const router = useRouter();
  const [target, setTarget] = useState<{ url: string; label: string } | null>(null);

  useEffect(() => {
    const entry = ROOTS[(params?.vertical || '').toLowerCase()];
    if (!entry) {
      router.replace('/dashboard');
      return;
    }
    let url = `${entry.root}/dashboard`;
    try {
      const token = window.localStorage.getItem('access_token');
      if (token) url = `${url}#access_token=${encodeURIComponent(token)}`;
    } catch {
      // storage unavailable — launch signed out
    }
    setTarget({ url, label: entry.label });
    window.location.replace(url);
  }, [params, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-6 text-center dark:bg-stone-950">
      <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
        Opening {target?.label ?? 'the app'}…
      </p>
      <p className="max-w-sm text-sm text-stone-500 dark:text-stone-400">
        {target ? (
          <>
            Not redirected?{' '}
            <a href={target.url} className="font-semibold text-indigo-700 dark:text-indigo-400">
              Open it directly
            </a>{' '}
            or go back to the{' '}
            <Link href="/dashboard" className="font-semibold text-indigo-700 dark:text-indigo-400">
              dashboard
            </Link>
            .
          </>
        ) : (
          'One moment.'
        )}
      </p>
    </div>
  );
}
