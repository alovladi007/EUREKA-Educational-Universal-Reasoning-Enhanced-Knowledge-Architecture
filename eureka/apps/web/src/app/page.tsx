'use client';

// Marketing homepage, editorial edition. Warm paper surfaces, ink text, one
// indigo accent, letterspaced kickers, monospace stats — a storefront that
// reads like a well-set book. Live platform stats come from the public API;
// the catalogue data is shared with /programs and /programs/[slug] so the
// pages can never disagree. JSON-LD and the SEO course list are preserved
// from the previous homepage.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  CtaPrimary,
  CtaSecondary,
  CtaBand,
  Stat,
} from '@/components/marketing/chrome';
import {
  FAMILIES,
  PROGRAMS,
  COMMITMENTS,
  OUTCOMES,
  featuredPrograms,
  programCount,
  LEVEL_LABEL,
} from '@/lib/marketing';

const PUBLIC_API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${
  process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1'
}`;

type PublicCourse = {
  id: string;
  title: string;
  subject: string | null;
  description: string;
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EUREKA',
  alternateName: 'Educational Universal Reasoning & Enhanced Knowledge Architecture',
  url: 'https://eureka.example.com',
  description:
    'Adaptive courses, graded practice, and a personal AI tutor — from high school to professional licensure.',
  sameAs: [] as string[],
};

const AUDIENCES = [
  {
    title: 'School',
    lead: 'Grades 9–12',
    desc: 'Core curriculum with graded practice, an AI tutor on call, and a straight line into SAT preparation and the undergraduate pathways.',
    href: '/dashboard/high-school',
  },
  {
    title: 'University',
    lead: 'Undergraduate → doctoral',
    desc: 'Degree-level coursework across disciplines — a mathematics ladder to graduate analysis, engineering at textbook depth, clinical foundations.',
    href: '/dashboard/undergraduate',
  },
  {
    title: 'Profession',
    lead: 'Licensure & careers',
    desc: 'Patent Bar, Security+, FE/PE and eight more exams — real question banks, timed mocks, and analytics that read like the score report.',
    href: '/dashboard/test-prep',
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Everything a self-directed learner needs.',
    features: [
      'Full course catalogue',
      'Adaptive practice & AI tutor',
      'Progress tracking & certificates',
      'Community access',
    ],
    cta: 'Join for free',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'Institutions',
    price: 'Custom',
    period: '',
    desc: 'For schools, universities, and teams.',
    features: [
      'Everything in Free',
      'SSO / SAML & LTI 1.3',
      'Cohorts, analytics & reporting',
      'FERPA / COPPA / HIPAA controls',
      'Priority support',
    ],
    cta: 'Talk to us',
    href: '/institutions',
    highlight: true,
  },
];

const FAQ = [
  {
    q: 'Is EUREKA free to use?',
    a: 'Yes — create a free account and start learning across the full catalogue right away. Institutions can add SSO, cohorts, and analytics with a custom plan.',
  },
  {
    q: 'What can I learn here?',
    a: 'High-school through graduate coursework, a full mathematics ladder, engineering courses at textbook depth, medical education, and preparation for eleven exams including the Patent Bar, LSAT, MCAT, GRE and SAT.',
  },
  {
    q: 'Do I get a certificate?',
    a: 'Yes — you earn certificates as you complete programs and demonstrate real mastery, not just by watching videos.',
  },
  {
    q: 'How does the AI tutor work?',
    a: 'It gives step-by-step, personalised help on the exact problem you are stuck on, and every practice item is auto-graded with specific feedback.',
  },
  {
    q: 'Can my school or company use it?',
    a: 'Absolutely. EUREKA supports single sign-on, LTI 1.3, cohort management, and FERPA/COPPA/HIPAA compliance controls for institutions.',
  },
];

export default function HomePage() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch(`${PUBLIC_API}/public/courses?limit=8`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCourses(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const flagship = featuredPrograms().slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {courses.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: courses.slice(0, 8).map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'Course',
                  name: c.title,
                  description: c.description || undefined,
                  provider: { '@type': 'Organization', name: 'EUREKA', sameAs: JSON_LD.url },
                },
              })),
            }),
          }}
        />
      )}

      <MarketingNav />

      <main id="main">
        {/* ---- Hero: headline left, program-family rail right ---- */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:px-8 lg:pt-24">
            <div>
              <Kicker>Educational Universal Reasoning &amp; Enhanced Knowledge Architecture</Kicker>
              <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Learning engineered for mastery
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600 dark:text-stone-400">
                Adaptive courses, machine-graded practice, and a personal AI tutor — from ninth-grade
                algebra to graduate device physics to the Patent Bar. Built as one platform, so every
                hour of work compounds.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <CtaPrimary href="/programs">Browse the programs</CtaPrimary>
                <CtaSecondary href="/auth/register">Join for free</CtaSecondary>
              </div>
            </div>

            <div>
              <Kicker>Program families</Kicker>
              <ul className="mt-4 divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
                {FAMILIES.map((f) => (
                  <li key={f.key}>
                    <Link
                      href={`/programs?family=${f.key}`}
                      className="group flex items-center justify-between gap-4 py-4 text-sm"
                    >
                      <span className="font-medium text-stone-800 group-hover:text-indigo-700 dark:text-stone-200 dark:group-hover:text-indigo-400">
                        {f.name}
                      </span>
                      <span className="font-mono text-xs text-stone-400 dark:text-stone-500">
                        {programCount(f.key)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/programs"
                className="mt-4 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                All programs →
              </Link>
            </div>
          </div>
        </section>

        {/* ---- Stats band: stable, verifiable platform facts ---- */}
        <section className="border-b border-stone-200 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-900/40" aria-label="At a glance">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-stone-200 px-4 dark:divide-stone-800 sm:px-6 lg:grid-cols-4 lg:px-8">
            <Stat value="11" label="Exams prepared" />
            <Stat value="1368" label="Patent Bar QBank items" />
            <Stat value="60" label="Modules, flagship course" />
            <Stat value="200+" label="Mathematics lessons" />
          </div>
        </section>

        {/* ---- Three audiences, one platform ---- */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Who it serves</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Three stages of a life in learning, one engineering stack
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-400">
              School, university and professional licensure reward different things — but the machinery
              of mastery is the same. One account and one transcript carry you across all three.
            </p>
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 md:grid-cols-3">
              {AUDIENCES.map((a) => (
                <Link
                  key={a.title}
                  href={a.href}
                  className="group bg-white p-8 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">{a.lead}</p>
                  <h3 className="mt-3 text-xl font-bold tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Catalogue families ---- */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Catalogue</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">What we build</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-400">
              Six program families that compose into a curriculum — or stand alone for the one goal in
              front of you.
            </p>
            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {FAMILIES.map((f) => (
                <div key={f.key} className="border-t-2 border-stone-900 pt-5 dark:border-stone-200">
                  <h3 className="text-lg font-bold tracking-tight">{f.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{f.blurb}</p>
                  <Link
                    href={`/programs?family=${f.key}`}
                    className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View programs →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Selected programs (flagship cards) ---- */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Kicker>Selected programs</Kicker>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Start here</h2>
              </div>
              <Link
                href="/programs"
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                All {PROGRAMS.length} programs →
              </Link>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 sm:grid-cols-2 lg:grid-cols-4">
              {flagship.map((p) => (
                <Link
                  key={p.slug}
                  href={`/programs/${p.slug}`}
                  className="group flex flex-col bg-white p-7 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-stone-400 dark:text-stone-500">{p.code}</span>
                    {p.badge && (
                      <span className="rounded-sm border border-emerald-600/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-400">{p.blurb}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.levels.map((l) => (
                      <span
                        key={l}
                        className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                      >
                        {LEVEL_LABEL[l]}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The four commitments ---- */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>How we teach</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Four commitments we design against
            </h2>
            <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
              {COMMITMENTS.map((c) => (
                <div key={c.n} className="flex gap-6">
                  <span className="font-mono text-2xl font-medium text-stone-300 dark:text-stone-700">{c.n}</span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/methods"
              className="mt-10 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              The full method →
            </Link>
          </div>
        </section>

        {/* ---- Outcomes preview ---- */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Kicker>Outcomes</Kicker>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Where this platform goes to work
                </h2>
              </div>
              <Link
                href="/outcomes"
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                All outcomes →
              </Link>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {OUTCOMES.slice(0, 6).map((o) => (
                <div key={o.id} className="border-t border-stone-200 pt-5 dark:border-stone-800">
                  <h3 className="text-base font-bold tracking-tight">{o.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Pricing ---- */}
        <section id="pricing" className="scroll-mt-20 border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Pricing</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Free for learners. Priced for institutions.
            </h2>
            <div className="mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
              {PRICING.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-lg border p-8 ${
                    tier.highlight
                      ? 'border-indigo-700 bg-white shadow-sm dark:border-indigo-500 dark:bg-stone-900'
                      : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-bold tracking-tight">{tier.name}</h3>
                    <p className="font-mono text-2xl font-medium">
                      {tier.price}
                      {tier.period && (
                        <span className="ml-1 text-xs text-stone-500 dark:text-stone-400">/ {tier.period}</span>
                      )}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{tier.desc}</p>
                  <ul className="mt-6 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                        <i className="fas fa-check mt-1 text-xs text-indigo-700 dark:text-indigo-400" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className={`mt-8 block rounded-md px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                      tier.highlight
                        ? 'bg-indigo-700 text-white hover:bg-indigo-800'
                        : 'border border-stone-300 text-stone-900 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Questions</Kicker>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Answers, briefly</h2>
            <div className="mt-10 max-w-3xl divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
              {FAQ.map((item, i) => (
                <div key={item.q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-base font-semibold">{item.q}</span>
                    <i
                      className={`fas fa-plus text-xs text-stone-400 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}
                      aria-hidden
                    />
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 pr-8 text-sm leading-6 text-stone-600 dark:text-stone-400">{item.a}</p>
                  )}
                </div>
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
