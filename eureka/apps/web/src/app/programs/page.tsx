'use client';

// /programs — the catalogue. Search plus family/level filter chips over the
// shared marketing data, in the same editorial style as the homepage. The
// ?family= query param (used by home-page links) preselects a family chip.

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  CtaBand,
} from '@/components/marketing/chrome';
import { FAMILIES, PROGRAMS, LEVEL_LABEL, type Level } from '@/lib/marketing';

const LEVELS: Level[] = ['HS', 'UG', 'GR', 'PRO'];

function chipCls(active: boolean) {
  return `rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border-indigo-700 bg-indigo-700/5 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-400/10 dark:text-indigo-300'
      : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-500'
  }`;
}

function Catalogue() {
  const params = useSearchParams();
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<string>(params.get('family') || 'all');
  const [level, setLevel] = useState<string>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMS.filter((p) => {
      if (family !== 'all' && p.family !== family) return false;
      if (level !== 'all' && !p.levels.includes(level as Level)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
      );
    });
  }, [query, family, level]);

  return (
    <>
      {/* Filter bar */}
      <section className="border-b border-stone-200 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative max-w-xl">
            <i className="fas fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code, or capability"
              aria-label="Search programs"
              className="w-full rounded-md border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
              Family
            </span>
            <button onClick={() => setFamily('all')} className={chipCls(family === 'all')}>
              All
            </button>
            {FAMILIES.map((f) => (
              <button key={f.key} onClick={() => setFamily(f.key)} className={chipCls(family === f.key)}>
                {f.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
              Level
            </span>
            <button onClick={() => setLevel('all')} className={chipCls(level === 'all')}>
              All
            </button>
            {LEVELS.map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={chipCls(level === l)}>
                {LEVEL_LABEL[l]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-white dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="border-b border-stone-200 pb-4 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
            {results.length} program{results.length === 1 ? '' : 's'}
          </p>
          {results.length === 0 ? (
            <p className="py-16 text-center text-sm text-stone-500 dark:text-stone-400">
              Nothing matches that filter — try clearing the search or choosing another family.
            </p>
          ) : (
            <ul className="divide-y divide-stone-200 dark:divide-stone-800">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.detail ? `/programs/${p.slug}` : p.href}
                    className="group grid gap-2 py-6 sm:grid-cols-[110px_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <span className="font-mono text-xs text-stone-400 dark:text-stone-500">{p.code}</span>
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold tracking-tight text-stone-900 group-hover:text-indigo-700 dark:text-stone-100 dark:group-hover:text-indigo-400">
                          {p.title}
                        </span>
                        {p.badge && (
                          <span className="rounded-sm border border-emerald-600/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            {p.badge}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-stone-600 dark:text-stone-400">{p.blurb}</span>
                    </span>
                    <span className="flex gap-1.5 sm:justify-end">
                      {p.levels.map((l) => (
                        <span
                          key={l}
                          className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                        >
                          {l}
                        </span>
                      ))}
                    </span>
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

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <MarketingNav />
      <main id="main">
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <Kicker>Catalogue</Kicker>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Programs for every stage of mastery
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">
              {PROGRAMS.length} programs across {FAMILIES.length} families — exam preparation, full
              disciplines, and degree pathways. Every one is browsable before you sign in.
            </p>
            <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
              Looking for individual courses?{' '}
              <Link href="/explore" className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400">
                Browse the live course catalogue →
              </Link>
            </p>
          </div>
        </section>
        <Suspense fallback={null}>
          <Catalogue />
        </Suspense>
        <CtaBand />
      </main>
      <MarketingFooter />
    </div>
  );
}
