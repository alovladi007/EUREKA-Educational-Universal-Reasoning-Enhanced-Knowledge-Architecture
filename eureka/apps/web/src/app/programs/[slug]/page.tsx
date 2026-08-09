// /programs/[slug] — detail pages for the flagship programs, generated from
// the shared marketing data. Programs without a `detail` block simply are not
// generated here (their catalogue cards link straight into the app).

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  CtaPrimary,
  CtaSecondary,
  CtaBand,
} from '@/components/marketing/chrome';
import { PROGRAMS, programBySlug, familyByKey, LEVEL_LABEL } from '@/lib/marketing';

export function generateStaticParams() {
  return PROGRAMS.filter((p) => p.detail).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = programBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} — EUREKA`,
    description: p.blurb,
  };
}

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const p = programBySlug(params.slug);
  if (!p || !p.detail) notFound();
  const d = p.detail;
  const family = familyByKey(p.family);
  const related = PROGRAMS.filter((r) => r.family === p.family && r.slug !== p.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <MarketingNav />
      <main id="main">
        {/* Hero */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:px-8">
            <nav className="text-sm text-stone-500 dark:text-stone-400" aria-label="Breadcrumb">
              <Link href="/programs" className="hover:text-stone-900 dark:hover:text-stone-100">
                Programs
              </Link>
              <span className="mx-2">/</span>
              <span className="font-mono text-xs">{p.code}</span>
            </nav>
            <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              <div>
                <Kicker>{family?.name ?? 'Program'}</Kicker>
                <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{p.title}</h1>
                <p className="mt-3 text-lg font-medium text-stone-700 dark:text-stone-300">{p.tagline}</p>
                <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-400">{d.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CtaPrimary href={p.href}>Open this program</CtaPrimary>
                  <CtaSecondary href="/auth/register">Join for free</CtaSecondary>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {p.levels.map((l) => (
                    <span
                      key={l}
                      className="rounded-sm bg-stone-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                    >
                      {LEVEL_LABEL[l]}
                    </span>
                  ))}
                  {p.badge && (
                    <span className="rounded-sm border border-emerald-600/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {p.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Specs card */}
              <div>
                <Kicker>At a glance</Kicker>
                <dl className="mt-4 divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
                  {d.specs.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                      <dt className="text-sm text-stone-500 dark:text-stone-400">{k}</dt>
                      <dd className="text-right font-mono text-sm text-stone-900 dark:text-stone-100">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>What&apos;s inside</Kicker>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">The parts that do the work</h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 sm:grid-cols-2">
              {d.inside.map((item) => (
                <div key={item.title} className="bg-white p-8 dark:bg-stone-950">
                  <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it teaches */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>How it teaches</Kicker>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Principles behind the build</h2>
            <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-3">
              {d.teach.map((t, i) => (
                <div key={t.title} className="flex gap-5">
                  <span className="font-mono text-xl font-medium text-stone-300 dark:text-stone-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-bold tracking-tight">{t.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-sm text-stone-500 dark:text-stone-400">
              The platform-wide version of these principles lives on{' '}
              <Link href="/methods" className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400">
                Methods →
              </Link>
            </p>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <Kicker>Related programs</Kicker>
              <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 md:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={r.detail ? `/programs/${r.slug}` : r.href}
                    className="group bg-white p-7 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
                  >
                    <span className="font-mono text-xs text-stone-400 dark:text-stone-500">{r.code}</span>
                    <h3 className="mt-3 text-base font-bold tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{r.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBand
          title={`Start ${p.title} today`}
          desc="Free account, full access. Your progress, review queue and certificates travel with you across every program on the platform."
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
