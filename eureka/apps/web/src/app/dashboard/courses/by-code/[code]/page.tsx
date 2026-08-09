'use client';

// /dashboard/courses/by-code/[code] — stable deep link into a course reader
// by course code (e.g. ELEC-DEV) instead of a database UUID, so marketing
// pages and external links never have to hardcode an environment-specific
// id. Resolves via the public catalogue and forwards to the course page.

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PUBLIC_API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${
  process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1'
}`;

type PublicCourse = { id: string; code: string | null };

export default function CourseByCodePage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const code = decodeURIComponent(params?.code || '').toUpperCase();
    if (!code) {
      router.replace('/dashboard/courses');
      return;
    }
    let cancelled = false;
    const findIn = (list: unknown) =>
      Array.isArray(list)
        ? (list as PublicCourse[]).find((c) => (c.code || '').toUpperCase() === code)
        : undefined;
    // The public API caps limit at 60; fall back to a q= search if the code
    // is not in the first page.
    fetch(`${PUBLIC_API}/public/courses?limit=60`)
      .then((r) => (r.ok ? r.json() : []))
      .then(async (list) => {
        if (cancelled) return;
        let hit = findIn(list);
        if (!hit) {
          const r2 = await fetch(`${PUBLIC_API}/public/courses?limit=60&q=${encodeURIComponent(code)}`);
          hit = findIn(r2.ok ? await r2.json() : []);
        }
        if (cancelled) return;
        if (hit) router.replace(`/dashboard/courses/${hit.id}`);
        else setFailed(true);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      {failed ? (
        <>
          <p className="text-lg font-semibold">Course not found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t resolve the code &ldquo;{decodeURIComponent(params?.code || '')}&rdquo;.
            Browse{' '}
            <Link href="/dashboard/courses" className="font-semibold text-indigo-700 dark:text-indigo-400">
              your courses
            </Link>{' '}
            or the{' '}
            <Link href="/explore" className="font-semibold text-indigo-700 dark:text-indigo-400">
              full catalogue
            </Link>
            .
          </p>
        </>
      ) : (
        <p className="text-lg font-semibold">Opening the course…</p>
      )}
    </div>
  );
}
