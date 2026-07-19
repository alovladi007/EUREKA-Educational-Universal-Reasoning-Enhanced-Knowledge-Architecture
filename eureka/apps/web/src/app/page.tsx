'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

// Marketing homepage. Real data (public API), a browsable /explore catalogue so
// visitors can look before signing in, honest social proof, pricing, FAQ, SEO
// metadata, an accessibility pass, and dark-mode support. Calm blue/slate
// palette, restrained motion — a credible, professional first impression.

const PUBLIC_API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${
  process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1'
}`;

type Stats = { learners: number; courses: number; institutions: number; subjects: number };
type PublicCourse = {
  id: string;
  title: string;
  subject: string | null;
  category: string | null;
  level: string | null;
  description: string;
  code: string | null;
};

const CATEGORIES = [
  { icon: 'fa-square-root-variable', name: 'Mathematics', desc: 'Pre-algebra through graduate analysis.', href: '/dashboard' },
  { icon: 'fa-clipboard-check', name: 'Test Preparation', desc: 'LSAT, MCAT, GRE, SAT, Patent Bar and more.', href: '/dashboard/test-prep' },
  { icon: 'fa-stethoscope', name: 'Medical Education', desc: 'Clinical foundations with real AI imaging tools.', href: '/dashboard/medical' },
  { icon: 'fa-graduation-cap', name: 'Undergraduate', desc: 'Bachelor-level courses across disciplines.', href: '/dashboard/undergraduate' },
  { icon: 'fa-user-graduate', name: 'Graduate', desc: "Master's and doctoral coursework.", href: '/dashboard/graduate' },
  { icon: 'fa-school', name: 'High School', desc: 'Grades 9–12 core curriculum and college prep.', href: '/dashboard/high-school' },
  { icon: 'fa-robot', name: 'AI Tutor', desc: 'Personalised, step-by-step help around the clock.', href: '/dashboard/tutor' },
  { icon: 'fa-vr-cardboard', name: 'XR Labs', desc: 'Immersive 3D labs for anatomy and the sciences.', href: '/dashboard/xr-labs' },
];

const VALUES = [
  { icon: 'fa-wand-magic-sparkles', title: 'Adaptive by design', desc: 'Every path adjusts to what you have mastered, so you spend time where it counts.' },
  { icon: 'fa-circle-check', title: 'Practice that grades itself', desc: 'Auto-graded problems and worked solutions give instant, specific feedback.' },
  { icon: 'fa-certificate', title: 'Credentials that count', desc: 'Earn certificates as you complete programs and demonstrate real mastery.' },
  { icon: 'fa-user-clock', title: 'Learn at your pace', desc: 'Start, pause, and resume on any device — your progress follows you.' },
];

const STEPS = [
  { n: '1', title: 'Choose a path', desc: 'Pick a subject or exam and get a plan mapped to your goal.' },
  { n: '2', title: 'Learn and practice', desc: 'Work through lessons and graded practice with an AI tutor on call.' },
  { n: '3', title: 'Track your mastery', desc: 'Watch your skills grow and earn certificates as you go.' },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Everything a self-directed learner needs to get started.',
    features: ['Full course catalogue', 'Adaptive practice & AI tutor', 'Progress tracking & certificates', 'Community access'],
    cta: 'Join for free',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'Institutions',
    price: 'Custom',
    period: '',
    desc: 'For schools, universities, and teams.',
    features: ['Everything in Free', 'SSO / SAML & LTI 1.3', 'Cohorts, analytics & reporting', 'FERPA / COPPA / HIPAA controls', 'Priority support'],
    cta: 'Talk to us',
    href: '/institutions',
    highlight: true,
  },
];

const FAQ = [
  { q: 'Is EUREKA free to use?', a: 'Yes — create a free account and start learning across the full catalogue right away. Institutions can add SSO, cohorts, and analytics with a custom plan.' },
  { q: 'What can I learn here?', a: 'From high-school and undergraduate courses to graduate topics, medical education, test prep (LSAT, MCAT, GRE, SAT, Patent Bar and more), and a deep mathematics track.' },
  { q: 'Do I get a certificate?', a: 'Yes — you earn certificates as you complete programs and demonstrate real mastery, not just by watching videos.' },
  { q: 'How does the AI tutor work?', a: 'It gives step-by-step, personalised help on the exact problem you are stuck on, and every practice item is auto-graded with specific feedback.' },
  { q: 'Can my school or company use it?', a: 'Absolutely. EUREKA supports single sign-on, LTI 1.3, cohort management, and FERPA/COPPA/HIPAA compliance controls for institutions.' },
];

const SUBJECT_ICON: Record<string, string> = {
  mathematics: 'fa-square-root-variable',
  computer_science: 'fa-code',
  economics: 'fa-chart-line',
  english: 'fa-book-open',
  science: 'fa-flask',
  physics: 'fa-atom',
  chemistry: 'fa-flask',
  biology: 'fa-dna',
  medical: 'fa-stethoscope',
};
const ACCENTS = ['bg-primary-600', 'bg-indigo-600', 'bg-rose-600', 'bg-emerald-600', 'bg-amber-600', 'bg-violet-600', 'bg-cyan-600', 'bg-fuchsia-600'];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EUREKA',
  alternateName: 'Educational Universal Reasoning & Enhanced Knowledge Architecture',
  url: 'https://eureka.example.com',
  description: 'Adaptive courses, graded practice, and a personal AI tutor — from high school to professional degrees.',
  sameAs: [] as string[],
};

export default function HomePage() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<PublicCourse[]>([]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    fetch(`${PUBLIC_API}/public/stats`).then((r) => (r.ok ? r.json() : null)).then(setStats).catch(() => {});
    fetch(`${PUBLIC_API}/public/courses?limit=8`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCourses(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const fmt = (n?: number | null) => (n == null ? '—' : n.toLocaleString());
  const iconFor = (s?: string | null) => SUBJECT_ICON[(s || '').toLowerCase()] || 'fa-graduation-cap';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explore${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  const linkCls = 'text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white';

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="EUREKA home">
              <i className="fas fa-graduation-cap text-2xl text-primary-600" aria-hidden />
              <span className="text-xl font-bold tracking-tight">EUREKA</span>
            </Link>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
              <Link href="/explore" className={linkCls}>Explore</Link>
              <Link href="/dashboard/test-prep" className={linkCls}>Test Prep</Link>
              <Link href="/institutions" className={linkCls}>For Institutions</Link>
              <Link href="#pricing" className={linkCls}>Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle dark mode"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <i className={`fas ${resolvedTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden />
              </button>
            )}
            <Link href="/auth/login" className="hidden text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white md:inline">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="hidden rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 md:inline-block"
            >
              Join for free
            </Link>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} aria-hidden />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">
            <nav className="space-y-1 px-4 py-3" aria-label="Mobile">
              {[
                ['Explore', '/explore'],
                ['Test Prep', '/dashboard/test-prep'],
                ['For Institutions', '/institutions'],
                ['Pricing', '#pricing'],
                ['Log in', '/auth/login'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Join for free
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main id="main">
        {/* Hero */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/60 to-white dark:border-gray-900 dark:from-primary-950/20 dark:to-gray-950">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
                From high school to a professional career
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Learn without limits.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Master any subject with adaptive courses, graded practice, and a personal AI tutor —
                built for students, educators, and institutions alike.
              </p>

              <form
                onSubmit={handleSearch}
                role="search"
                className="mt-8 flex max-w-xl overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-primary-900"
              >
                <span className="flex items-center pl-4 text-gray-400"><i className="fas fa-magnifying-glass" aria-hidden /></span>
                <label htmlFor="hero-search" className="sr-only">Search courses</label>
                <input
                  id="hero-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="w-full bg-transparent px-3 py-3 text-sm placeholder-gray-400 focus:outline-none"
                />
                <button type="submit" className="shrink-0 bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                  Search
                </button>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-500" aria-hidden>
                    <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star-half-stroke" />
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Loved by learners</span>
                </span>
                <span className="hidden sm:inline">·</span>
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{fmt(stats?.learners)}</span> learners and counting
                </span>
              </div>
            </div>

            {/* Hero image — a real learner, framed as a circular portrait */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-learner.jpg"
                  alt="A EUREKA learner at their workstation"
                  width={1104}
                  height={1104}
                  loading="eager"
                  className="h-56 w-56 rounded-full border-4 border-white object-cover object-center shadow-xl ring-1 ring-gray-200 dark:border-gray-800 dark:ring-gray-700 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                />
                <div className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:flex">
                  <span className="text-emerald-600 dark:text-emerald-400"><i className="fas fa-users" aria-hidden /></span>
                  <span className="text-sm font-semibold">{fmt(stats?.learners)} learners</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats band — live from the public API */}
        <section className="border-b border-gray-100 bg-white dark:border-gray-900 dark:bg-gray-950" aria-label="At a glance">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              [fmt(stats?.learners), 'Learners'],
              [fmt(stats?.courses), 'Published courses'],
              [fmt(stats?.institutions), 'Institutions'],
              [fmt(stats?.subjects), 'Subjects'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold">{value}</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Explore top subjects</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Browse the areas learners come to EUREKA for most.</p>
              </div>
              <Link href="/explore" className="text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-400">
                View all courses <i className="fas fa-arrow-right ml-1 text-xs" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-primary-800"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
                    <i className={`fas ${cat.icon} text-lg`} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-400">{cat.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured courses — real, from the catalogue */}
        <section className="bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Courses on the platform</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">A sample of what you can start today — browse the full catalogue any time.</p>
              </div>
              <Link href="/explore" className="text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-400">
                Browse all <i className="fas fa-arrow-right ml-1 text-xs" aria-hidden />
              </Link>
            </div>

            {courses.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">The catalogue is coming online — check back shortly.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {courses.slice(0, 4).map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/explore${c.subject ? `?subject=${encodeURIComponent(c.subject)}` : ''}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className={`flex h-28 items-center justify-center ${ACCENTS[i % ACCENTS.length]}`}>
                      <i className={`fas ${iconFor(c.subject)} text-3xl text-white/90`} aria-hidden />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
                        {(c.subject || c.category || 'Course').replace(/_/g, ' ')}
                      </span>
                      <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-400">{c.title}</h3>
                      {c.description && (
                        <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-500 dark:text-gray-400">{c.description}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{c.level || 'All levels'}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">Course</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Value props */}
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Why learners choose EUREKA</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">A learning experience built around mastery, not just watching videos.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div key={v.title}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white">
                    <i className={`fas ${v.icon} text-lg`} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">How EUREKA works</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">Three steps from curious to confident.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="rounded-2xl border border-gray-100 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-base font-bold text-white">{step.n}</span>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust band — honest, driven by real counts */}
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight">Built for real learners and institutions</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
              EUREKA already supports learning across <span className="font-semibold text-gray-800 dark:text-gray-200">{fmt(stats?.institutions)}</span> institutions
              and <span className="font-semibold text-gray-800 dark:text-gray-200">{fmt(stats?.subjects)}</span> subjects — from individual students to full campuses.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                ['fa-shield-halved', 'Compliance-ready', 'FERPA / COPPA / HIPAA controls built in for schools and health programs.'],
                ['fa-bullseye', 'Mastery, not minutes', 'Adaptive paths and auto-graded practice target the exact gaps you have.'],
                ['fa-certificate', 'Verifiable certificates', 'Credentials that reflect demonstrated skill, issued as you complete work.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 text-left dark:border-gray-800 dark:bg-gray-950">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
                    <i className={`fas ${icon} text-lg`} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Simple, honest pricing</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">Free for individual learners. Custom plans for institutions.</p>
            </div>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              {PRICING.map((p) => (
                <div
                  key={p.name}
                  className={`flex flex-col rounded-2xl border p-8 ${
                    p.highlight
                      ? 'border-primary-600 shadow-lg dark:border-primary-500'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    {p.highlight && (
                      <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">Popular</span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    {p.period && <span className="text-sm text-gray-500 dark:text-gray-400">/ {p.period}</span>}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{p.desc}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <i className="fas fa-check text-primary-600" aria-hidden />
                        <span className="text-gray-700 dark:text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.href}
                    className={`mt-8 rounded-md px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                      p.highlight
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold focus-visible:ring-2 focus-visible:ring-primary-500">
                    {item.q}
                    <i className="fas fa-chevron-down text-sm text-gray-400 transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Audience segments */}
        <section className="bg-white dark:bg-gray-950">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-20">
            {[
              { icon: 'fa-user-graduate', title: 'For students', desc: 'Personalised paths, graded practice, and certificates that show real mastery.', href: '/auth/register', cta: 'Start learning' },
              { icon: 'fa-chalkboard-user', title: 'For educators', desc: 'Author courses, assign work, and let auto-grading and analytics save you hours.', href: '/dashboard/teacher', cta: 'Explore teacher tools' },
              { icon: 'fa-building-columns', title: 'For institutions', desc: 'Enterprise-grade, FERPA/COPPA compliant, with multi-tenant and LTI 1.3 support.', href: '/institutions', cta: 'Talk to us' },
            ].map((seg) => (
              <div key={seg.title} className="flex flex-col rounded-2xl border border-gray-200 p-8 dark:border-gray-800">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
                  <i className={`fas ${seg.icon} text-lg`} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{seg.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{seg.desc}</p>
                <Link href={seg.href} className="mt-5 text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-400">
                  {seg.cta} <i className="fas fa-arrow-right ml-1 text-xs" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-primary-700 dark:bg-primary-800">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to start learning?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-100">
              Create a free account and build real skills on EUREKA — it only takes a minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register" className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
                Create a free account
              </Link>
              <Link href="/explore" className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Browse the catalogue
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2" aria-label="EUREKA home">
                <i className="fas fa-graduation-cap text-2xl text-primary-600" aria-hidden />
                <span className="text-xl font-bold">EUREKA</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Educational Universal Reasoning &amp; Enhanced Knowledge Architecture — empowering learners
                from high school to professional degrees.
              </p>
              {subscribed ? (
                <p className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <i className="fas fa-circle-check" aria-hidden /> Thanks — you&apos;re on the list.
                </p>
              ) : (
                <form onSubmit={handleNewsletter} className="mt-6 flex max-w-sm overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
                  <label htmlFor="newsletter" className="sr-only">Email address</label>
                  <input
                    id="newsletter"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none dark:bg-gray-900"
                  />
                  <button type="submit" className="shrink-0 bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700">
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {[
              { title: 'Learn', links: [['Explore', '/explore'], ['Test Prep', '/dashboard/test-prep'], ['Pricing', '#pricing'], ['Interactive Demo', '/demo']] },
              { title: 'Company', links: [['For Institutions', '/institutions'], ['System Status', '/system-status'], ['Community', '/community'], ['Help Center', '/help']] },
              { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Contact', '/contact']] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 dark:border-gray-800 sm:flex-row">
            <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} EUREKA. All rights reserved.</p>
            <div className="flex gap-5 text-gray-400">
              <a href="#" aria-label="GitHub" className="hover:text-gray-600 dark:hover:text-gray-200"><i className="fab fa-github" aria-hidden /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-600 dark:hover:text-gray-200"><i className="fab fa-linkedin" aria-hidden /></a>
              <a href="#" aria-label="YouTube" className="hover:text-gray-600 dark:hover:text-gray-200"><i className="fab fa-youtube" aria-hidden /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
