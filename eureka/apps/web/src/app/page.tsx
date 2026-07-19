'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Marketing homepage, modelled on established education platforms (Coursera,
// edX, Khan Academy): a calm blue/slate palette, generous whitespace, real
// EUREKA offerings, and restrained motion. No gradient text, glassmorphism, or
// auto-rotating imagery — the goal is a credible, professional first impression.

const CATEGORIES = [
  { icon: 'fa-square-root-variable', name: 'Mathematics', desc: 'Pre-algebra through graduate analysis — 203 courses.', href: '/dashboard' },
  { icon: 'fa-clipboard-check', name: 'Test Preparation', desc: 'LSAT, MCAT, GRE, SAT, Patent Bar and 6 more.', href: '/dashboard/test-prep' },
  { icon: 'fa-stethoscope', name: 'Medical Education', desc: 'Clinical foundations with real AI imaging tools.', href: '/dashboard/medical' },
  { icon: 'fa-graduation-cap', name: 'Undergraduate', desc: 'Bachelor-level courses across disciplines.', href: '/dashboard/undergraduate' },
  { icon: 'fa-user-graduate', name: 'Graduate', desc: "Master's and doctoral coursework.", href: '/dashboard/graduate' },
  { icon: 'fa-school', name: 'High School', desc: 'Grades 9–12 core curriculum and college prep.', href: '/dashboard/high-school' },
  { icon: 'fa-robot', name: 'AI Tutor', desc: 'Personalised, step-by-step help around the clock.', href: '/dashboard/tutor' },
  { icon: 'fa-vr-cardboard', name: 'XR Labs', desc: 'Immersive 3D labs for anatomy and the sciences.', href: '/dashboard/xr-labs' },
];

const COURSES = [
  { subject: 'Mathematics', accent: 'bg-primary-600', icon: 'fa-square-root-variable', title: 'Calculus I: Limits & Derivatives', level: 'Beginner', rating: '4.8', learners: '48,200', tag: 'Certificate' },
  { subject: 'Test Prep', accent: 'bg-indigo-600', icon: 'fa-scale-balanced', title: 'LSAT Complete: Logic & Reading', level: 'All levels', rating: '4.9', learners: '31,500', tag: 'Exam prep' },
  { subject: 'Medical', accent: 'bg-rose-600', icon: 'fa-stethoscope', title: 'Clinical Foundations & Imaging', level: 'Intermediate', rating: '4.7', learners: '12,100', tag: 'Professional' },
  { subject: 'Mathematics', accent: 'bg-emerald-600', icon: 'fa-vector-square', title: 'Linear Algebra for Engineers', level: 'Intermediate', rating: '4.8', learners: '26,800', tag: 'Certificate' },
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

const TESTIMONIALS = [
  { quote: 'The adaptive practice found exactly the gaps in my calculus and closed them before my finals.', name: 'Maya R.', role: 'Undergraduate student', initials: 'MR' },
  { quote: 'I prepped for the LSAT entirely on EUREKA. The graded drills and analytics were a game changer.', name: 'Daniel K.', role: 'Law school applicant', initials: 'DK' },
  { quote: 'As a teacher, the auto-grading and progress dashboards give me back hours every single week.', name: 'Priya S.', role: 'High-school educator', initials: 'PS' },
];

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <i className="fas fa-graduation-cap text-2xl text-primary-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900">EUREKA</span>
            </Link>
            <nav className="hidden items-center gap-6 lg:flex">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Explore</Link>
              <Link href="/dashboard/test-prep" className="text-sm font-medium text-gray-600 hover:text-gray-900">Test Prep</Link>
              <Link href="/institutions" className="text-sm font-medium text-gray-600 hover:text-gray-900">For Institutions</Link>
              <Link href="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900">How it works</Link>
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900">Log in</Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Join for free
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white md:hidden">
            <nav className="space-y-1 px-4 py-3">
              {[
                ['Explore', '/dashboard'],
                ['Test Prep', '/dashboard/test-prep'],
                ['For Institutions', '/institutions'],
                ['How it works', '/demo'],
                ['Log in', '/auth/login'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
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

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-primary-50/60 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              From high school to a professional career
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Learn without limits.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              Master any subject with adaptive courses, graded practice, and a personal AI tutor —
              built for students, educators, and institutions alike.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-xl overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
              <span className="flex items-center pl-4 text-gray-400">
                <i className="fas fa-magnifying-glass" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full bg-transparent px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <button type="submit" className="shrink-0 bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-500">
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star-half-stroke" />
                </span>
                <span className="font-medium text-gray-700">4.8</span> average rating
              </span>
              <span className="hidden sm:inline">·</span>
              <span><span className="font-medium text-gray-700">500,000+</span> learners worldwide</span>
            </div>
          </div>

          {/* Product preview — a static mockup, not a photo */}
          <div className="relative lg:justify-self-end">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  <i className="fas fa-square-root-variable" /> Mathematics
                </span>
                <span className="text-xs font-medium text-gray-400">In progress</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Calculus I: Limits & Derivatives</h3>
              <p className="mt-1 text-sm text-gray-500">Lesson 7 of 12 · The Chain Rule</p>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
                  <span>Progress</span><span>68%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-primary-600" style={{ width: '68%' }} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[['24', 'Skills'], ['1,240', 'XP'], ['9', 'Day streak']].map(([v, l]) => (
                  <div key={l} className="rounded-lg bg-gray-50 py-3">
                    <div className="text-base font-bold text-gray-900">{v}</div>
                    <div className="text-[11px] text-gray-500">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <i className="fas fa-certificate" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Certificate earned</div>
                  <div className="text-xs text-gray-500">Algebra II · Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            ['500K+', 'Active learners'],
            ['10,000+', 'Courses & lessons'],
            ['96%', 'Completion rate'],
            ['150+', 'Countries'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-gray-900">{value}</div>
              <div className="mt-1 text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Explore top subjects</h2>
              <p className="mt-2 text-gray-600">Browse the areas learners come to EUREKA for most.</p>
            </div>
            <Link href="/dashboard" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
              View all programs <i className="fas fa-arrow-right ml-1 text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <i className={`fas ${cat.icon} text-lg`} />
                </span>
                <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-primary-700">{cat.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Most popular courses</h2>
            <p className="mt-2 text-gray-600">Hand-picked programs learners are enrolling in right now.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.map((course) => (
              <Link
                key={course.title}
                href="/dashboard"
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`flex h-28 items-center justify-center ${course.accent}`}>
                  <i className={`fas ${course.icon} text-3xl text-white/90`} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">{course.subject}</span>
                  <h3 className="mt-2 flex-1 font-semibold leading-snug text-gray-900 group-hover:text-primary-700">
                    {course.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-900">{course.rating}</span>
                    <span className="text-amber-500"><i className="fas fa-star text-xs" /></span>
                    <span className="text-gray-400">({course.learners})</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{course.level}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600">{course.tag}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Why learners choose EUREKA</h2>
            <p className="mt-3 text-gray-600">A learning experience built around mastery, not just watching videos.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title}>
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white">
                  <i className={`fas ${v.icon} text-lg`} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">How EUREKA works</h2>
            <p className="mt-3 text-gray-600">Three steps from curious to confident.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-base font-bold text-white">
                  {step.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900">Loved by learners and educators</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-3 text-amber-500">
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                </div>
                <blockquote className="flex-1 text-gray-700">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-gray-900">{t.name}</span>
                    <span className="block text-xs text-gray-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Audience segments */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-20">
          {[
            { icon: 'fa-user-graduate', title: 'For students', desc: 'Personalised paths, graded practice, and certificates that show real mastery.', href: '/auth/register', cta: 'Start learning' },
            { icon: 'fa-chalkboard-user', title: 'For educators', desc: 'Author courses, assign work, and let auto-grading and analytics save you hours.', href: '/dashboard/teacher', cta: 'Explore teacher tools' },
            { icon: 'fa-building-columns', title: 'For institutions', desc: 'Enterprise-grade, FERPA/COPPA compliant, with multi-tenant and LTI 1.3 support.', href: '/institutions', cta: 'Talk to us' },
          ].map((seg) => (
            <div key={seg.title} className="flex flex-col rounded-2xl border border-gray-200 p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <i className={`fas ${seg.icon} text-lg`} />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{seg.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{seg.desc}</p>
              <Link href={seg.href} className="mt-5 text-sm font-semibold text-primary-700 hover:text-primary-800">
                {seg.cta} <i className="fas fa-arrow-right ml-1 text-xs" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-primary-700">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to start learning?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-100">
            Join over half a million learners building real skills on EUREKA. It is free to get started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register" className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
              Create a free account
            </Link>
            <Link href="/dashboard" className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Browse the catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <i className="fas fa-graduation-cap text-2xl text-primary-600" />
                <span className="text-xl font-bold text-gray-900">EUREKA</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
                Educational Universal Reasoning &amp; Enhanced Knowledge Architecture — empowering learners
                from high school to professional degrees.
              </p>
              <form onSubmit={handleNewsletter} className="mt-6 flex max-w-sm overflow-hidden rounded-md border border-gray-300">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button type="submit" className="shrink-0 bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700">
                  Subscribe
                </button>
              </form>
            </div>

            {[
              { title: 'Learn', links: [['Explore', '/dashboard'], ['Test Prep', '/dashboard/test-prep'], ['Mathematics', '/dashboard'], ['Interactive Demo', '/demo']] },
              { title: 'Company', links: [['For Institutions', '/institutions'], ['System Status', '/system-status'], ['Community', '/community'], ['Help Center', '/help']] },
              { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Contact', '/contact']] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-gray-900">{col.title}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-gray-500 hover:text-primary-700">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} EUREKA. All rights reserved.</p>
            <div className="flex gap-5 text-gray-400">
              <a href="#" aria-label="GitHub" className="hover:text-gray-600"><i className="fab fa-github" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-600"><i className="fab fa-linkedin" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-gray-600"><i className="fab fa-youtube" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
