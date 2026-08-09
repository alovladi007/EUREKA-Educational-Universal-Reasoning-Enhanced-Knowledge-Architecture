'use client';

// Public, browsable course catalogue — no login required, powered by the
// /public/* API. Editorial edition: same warm surfaces, kickers, filter
// chips and hairline list rows as /programs, so the storefront and the live
// catalogue read as one product. Courses with a code deep-link through
// /dashboard/courses/by-code/[code] (login, then straight to the course).

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  CtaBand,
} from '@/components/marketing/chrome';

const PUBLIC_API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${
  process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1'
}`;

type Course = {
  id: string;
  title: string;
  subject: string | null;
  category: string | null;
  level: string | null;
  description: string;
  code: string | null;
};
type SubjectFacet = { subject: string; count: number };

const LEVELS = ['introductory', 'beginner', 'intermediate', 'advanced', 'expert'];

function chipCls(active: boolean) {
  return `rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border-indigo-700 bg-indigo-700/5 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-400/10 dark:text-indigo-300'
      : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-500'
  }`;
}

const pretty = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function ExploreInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get('q') || '';
  const initialSubject = params.get('subject') || '';

  const [query, setQuery] = useState(initialQ);
  const [subject, setSubject] = useState(initialSubject);
  const [level, setLevel] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<SubjectFacet[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ limit: '48' });
    if (query.trim()) p.set('q', query.trim());
    if (subject) p.set('subject', subject);
    if (level) p.set('level', level);
    try {
      const r = await fetch(`${PUBLIC_API}/public/courses?${p.toString()}`);
      setCourses(r.ok ? await r.json() : []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [query, subject, level]);

  useEffect(() => {
    fetch(`${PUBLIC_API}/public/subjects`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setSubjects)
      .catch(() => {});
  }, []);
  useEffect(() => {
    load();
  }, [subject, level]); // eslint-disable-line react-hooks/exhaustive-deps

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    if (subject) p.set('subject', subject);
    router.replace(`/explore${p.toString() ? `?${p}` : ''}`);
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
          <Kicker>Live catalogue</Kicker>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Explore the courses
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">
            The full public catalogue, browsable before you sign in. Every course here is live on
            the platform — open one and a free account takes you straight into it.
          </p>
          <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
            Looking for guided programs and exam preparation?{' '}
            <Link
              href="/programs"
              className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400"
            >
              Browse the programs →
            </Link>
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="border-b border-stone-200 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
          <form onSubmit={submitSearch} className="flex max-w-xl gap-2">
            <div className="relative flex-1">
              <i
                className="fas fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or topic"
                aria-label="Search courses"
                className="w-full rounded-md border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
            >
              Search
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
              Subject
            </span>
            <button onClick={() => setSubject('')} className={chipCls(subject === '')}>
              All
            </button>
            {subjects.map((s) => (
              <button
                key={s.subject}
                onClick={() => setSubject(s.subject)}
                className={chipCls(subject === s.subject)}
              >
                {pretty(s.subject)}
                <span className="ml-1.5 font-mono text-xs text-stone-400 dark:text-stone-500">
                  {s.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
              Level
            </span>
            <button onClick={() => setLevel('')} className={chipCls(level === '')}>
              All
            </button>
            {LEVELS.map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={chipCls(level === l)}>
                {pretty(l)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-white dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="border-b border-stone-200 pb-4 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
            {loading ? 'Loading…' : `${courses.length} course${courses.length === 1 ? '' : 's'}`}
          </p>
          {!loading && courses.length === 0 ? (
            <p className="py-16 text-center text-sm text-stone-500 dark:text-stone-400">
              Nothing matches that filter — try clearing the search or choosing another subject.
            </p>
          ) : (
            <ul className="divide-y divide-stone-200 dark:divide-stone-800">
              {courses.map((c) => (
                <li key={c.id}>
                  <Link
                    href={c.code ? `/dashboard/courses/by-code/${encodeURIComponent(c.code)}` : '/auth/register'}
                    className="group grid gap-2 py-6 sm:grid-cols-[110px_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <span className="font-mono text-xs text-stone-400 dark:text-stone-500">
                      {c.code || '—'}
                    </span>
                    <span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                        {pretty(c.subject || c.category || 'Course')}
                      </span>
                      <span className="mt-1 block text-base font-bold tracking-tight text-stone-900 group-hover:text-indigo-700 dark:text-stone-100 dark:group-hover:text-indigo-400">
                        {c.title}
                      </span>
                      <span className="mt-1 block max-w-3xl text-sm leading-6 text-stone-600 dark:text-stone-400">
                        {c.description}
                      </span>
                    </span>
                    {c.level && (
                      <span className="self-start rounded-sm bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:bg-stone-800 dark:text-stone-400 sm:justify-self-end">
                        {pretty(c.level)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <MarketingNav />
      <main id="main">
        <Suspense fallback={null}>
          <ExploreInner />
        </Suspense>
        <CtaBand
          title="Open a course and start today"
          desc="A free account takes you from any course on this page straight into its first lesson — progress, practice and certificates included."
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
