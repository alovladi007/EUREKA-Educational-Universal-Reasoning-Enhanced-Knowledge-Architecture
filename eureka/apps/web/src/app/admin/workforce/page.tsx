'use client';

/**
 * Workforce admin lives in the workforce partner portal
 * (/institutions/partnerships). This stub announces the handoff while it
 * redirects, and offers a fallback link — so the jump between the console
 * and the portal is marked, never silent.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkforceMovedRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/institutions/partnerships');
  }, [router]);
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
          Leaving the console
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Opening the workforce partner portal…</h1>
        <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">
          Workforce admin — partnerships, seats, programs and workplace compliance — lives in its
          own portal. Not redirected?{' '}
          <Link
            href="/institutions/partnerships"
            className="font-semibold text-indigo-700 dark:text-indigo-400"
          >
            Open it directly
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
