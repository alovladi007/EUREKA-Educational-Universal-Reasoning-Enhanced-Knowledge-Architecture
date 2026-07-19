'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

// Public, browsable course catalogue — no login required. Powered by the
// /public/* API so logged-out visitors can look before they sign in.

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

const ACCENTS = ['bg-primary-600', 'bg-indigo-600', 'bg-rose-600', 'bg-emerald-600', 'bg-amber-600', 'bg-violet-600', 'bg-cyan-600', 'bg-fuchsia-600'];
const SUBJECT_ICON: Record<string, string> = {
  mathematics: 'fa-square-root-variable',
  computer_science: 'fa-code',
  economics: 'fa-chart-line',
  english: 'fa-book-open',
  science: 'fa-flask',
  medical: 'fa-stethoscope',
};
const LEVELS = ['introductory', 'beginner', 'intermediate', 'advanced', 'expert'];

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
    fetch(`${PUBLIC_API}/public/subjects`).then((r) => (r.ok ? r.json() : [])).then(setSubjects).catch(() => {});
  }, []);
  useEffect(() => {
    load();
  }, [subject, level]); // eslint-disable-line react-hooks/exhaustive-deps

  const iconFor = (s?: string | null) => SUBJECT_ICON[(s || '').toLowerCase()] || 'fa-graduation-cap';

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    if (subject) p.set('subject', subject);
    router.replace(`/explore${p.toString() ? `?${p}` : ''}`);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="EUREKA home">
            <i className="fas fa-graduation-cap text-2xl text-primary-600" aria-hidden />
            <span className="text-xl font-bold tracking-tight">EUREKA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">Log in</Link>
            <Link href="/auth/register" className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">Join for free</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore courses</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Browse the full catalogue — no account needed.</p>

        <form onSubmit={submitSearch} role="search" className="mt-6 flex max-w-2xl overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-primary-500 dark:border-gray-700 dark:bg-gray-900">
          <span className="flex items-center pl-4 text-gray-400"><i className="fas fa-magnifying-glass" aria-hidden /></span>
          <label htmlFor="explore-q" className="sr-only">Search courses</label>
          <input
            id="explore-q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="w-full bg-transparent px-3 py-3 text-sm placeholder-gray-400 focus:outline-none"
          />
          <button type="submit" className="shrink-0 bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700">Search</button>
        </form>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubject('')}
            className={`rounded-full border px-3 py-1 text-sm ${subject === '' ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300' : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900'}`}
          >
            All subjects
          </button>
          {subjects.map((s) => (
            <button
              key={s.subject}
              onClick={() => setSubject(s.subject)}
              className={`rounded-full border px-3 py-1 text-sm capitalize ${subject === s.subject ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300' : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900'}`}
            >
              {s.subject.replace(/_/g, ' ')} <span className="text-gray-400">({s.count})</span>
            </button>
          ))}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="ml-auto h-8 rounded-md border border-gray-300 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            aria-label="Filter by level"
          >
            <option value="">Any level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l} className="capitalize">{l}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
          ) : courses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No courses match. Try clearing filters.</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{courses.length} course{courses.length === 1 ? '' : 's'}</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map((c, i) => (
                  <Link
                    key={c.id}
                    href="/auth/register"
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className={`flex h-24 items-center justify-center ${ACCENTS[i % ACCENTS.length]}`}>
                      <i className={`fas ${iconFor(c.subject)} text-2xl text-white/90`} aria-hidden />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
                        {(c.subject || c.category || 'Course').replace(/_/g, ' ')}
                      </span>
                      <h2 className="mt-2 font-semibold leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-400">{c.title}</h2>
                      {c.description && <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-500 dark:text-gray-400">{c.description}</p>}
                      <div className="mt-4 text-xs capitalize text-gray-500 dark:text-gray-400">{c.level || 'All levels'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-12 rounded-2xl bg-primary-700 px-6 py-8 text-center dark:bg-primary-800">
          <p className="text-lg font-semibold text-white">Create a free account to start any course.</p>
          <Link href="/auth/register" className="mt-4 inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50">
            Join for free
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-gray-500">Loading…</div>}>
      <ExploreInner />
    </Suspense>
  );
}
