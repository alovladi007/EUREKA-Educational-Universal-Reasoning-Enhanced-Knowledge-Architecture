// /about — what EUREKA is, what the name means, and the principles the
// platform is engineered against. Server component.

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  PageHero,
  CtaBand,
  Stat,
} from '@/components/marketing/chrome';

export const metadata: Metadata = {
  title: 'About — EUREKA',
  description:
    'EUREKA is the Educational Universal Reasoning & Enhanced Knowledge Architecture: one platform for mastery from high school through professional licensure.',
};

const PRINCIPLES = [
  {
    title: 'Mastery is measurable',
    body: 'We model what a learner actually knows — per skill, with real statistics — and we let that model, not a content calendar, decide what happens next. Progress on EUREKA means the model believes you, and the model is hard to fool.',
  },
  {
    title: 'Honesty is a feature',
    body: 'Official exam questions are labeled official; original items are labeled original. AI demonstrations say whether they run real inference. Statistics on this site come from the live platform or they are not shown. An education product that shades the truth about itself teaches the wrong lesson before the first login.',
  },
  {
    title: 'Depth is the moat',
    body: 'Anyone can list sixty topics. We would rather ship sixty modules that each survive a graduate student’s scrutiny — with the derivations on the page and the figures computed from the equations — than six hundred summaries that survive nobody’s.',
  },
  {
    title: 'One platform, compounding',
    body: 'The same account, mastery model, review queue and transcript serve a ninth grader, a doctoral student and a Patent Bar candidate. Everything a learner earns in one program makes the next one cheaper to conquer.',
  },
];

const PLATFORM_FACTS: [string, string][] = [
  ['Program families', '6'],
  ['Exams prepared', '11'],
  ['Flagship course modules', '60'],
  ['Mathematics lessons', '200+'],
  ['Question formats', '20+'],
  ['Proof verification', 'Lean 4'],
  ['Math grading', 'SymPy CAS'],
  ['Review scheduling', 'SM-2'],
  ['Institution auth', 'SSO / SAML, LTI 1.3'],
  ['Compliance', 'FERPA · COPPA · HIPAA'],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <MarketingNav />
      <main id="main">
        <PageHero
          kicker="About"
          title="Built like infrastructure, taught like a mentor"
          lead="EUREKA stands for Educational Universal Reasoning & Enhanced Knowledge Architecture — one platform for real mastery, from ninth-grade algebra to graduate device physics to professional licensure."
        />

        {/* The name, the idea */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
            <div>
              <Kicker>The idea</Kicker>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Education has a measurement problem
              </h2>
              <div className="mt-6 space-y-4 text-base leading-7 text-stone-600 dark:text-stone-400">
                <p>
                  Most learning software measures attendance: videos watched, streaks kept, percent
                  complete. None of that is knowledge. EUREKA was built around the harder question —
                  <em className="text-stone-800 dark:text-stone-200"> can you do the thing?</em> — and
                  around the machinery required to answer it honestly: graded practice, statistical
                  mastery models, spaced review, and verification strong enough to check a mathematical
                  proof.
                </p>
                <p>
                  The result is one architecture serving three audiences that education usually splits
                  across products: school students, university students, and professionals preparing
                  for licensure. They share an account, a transcript, and an engine — because the
                  difference between a ninth grader and a Patent Bar candidate is the material, not the
                  mechanics of mastery.
                </p>
              </div>
            </div>
            <div>
              <Kicker>Platform facts</Kicker>
              <dl className="mt-4 divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
                {PLATFORM_FACTS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-sm text-stone-500 dark:text-stone-400">{k}</dt>
                    <dd className="text-right font-mono text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Principles</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">What we refuse to compromise</h2>
            <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <div key={p.title} className="flex gap-6">
                  <span className="font-mono text-2xl font-medium text-stone-300 dark:text-stone-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem strip */}
        <section className="border-b border-stone-200 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-900/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-stone-200 px-4 dark:divide-stone-800 sm:px-6 lg:grid-cols-4 lg:px-8">
            <Stat value="3" label="Learning tiers" />
            <Stat value="6" label="Program families" />
            <Stat value="11" label="Exams" />
            <Stat value="1" label="Transcript" />
          </div>
        </section>

        {/* Pointers */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: 'The method in detail', desc: 'The grading, modeling and verification machinery.', href: '/methods', label: 'Methods' },
                { title: 'The full catalogue', desc: 'Every program, filterable by family and level.', href: '/programs', label: 'Programs' },
                { title: 'For institutions', desc: 'SSO, LTI 1.3, cohorts, analytics and compliance.', href: '/institutions', label: 'Institutions' },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-lg border border-stone-200 bg-white p-7 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-700 dark:hover:bg-stone-900"
                >
                  <h3 className="text-base font-bold tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{c.desc}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                    {c.label} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <MarketingFooter />
    </div>
  );
}
