'use client';

// Shared chrome for the marketing pages: editorial top nav, footer, and small
// primitives (kicker, CTA buttons, stat). Warm paper surfaces, ink text, a
// single indigo accent, letterspaced kickers and monospace figures — calm and
// print-like, consistent across /, /programs, /methods, /outcomes, /about
// and /support.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { EurekaMark } from '@/components/eureka-logo';
import { useAuthStore } from '@/stores/auth';

const NAV = [
  { label: 'Programs', href: '/programs' },
  { label: 'Methods', href: '/methods' },
  { label: 'Outcomes', href: '/outcomes' },
  { label: 'Institutions', href: '/institutions' },
  { label: 'Support', href: '/support' },
  { label: 'About', href: '/about' },
];

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
      {children}
    </p>
  );
}

export function CtaPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-md bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
    >
      {children}
    </Link>
  );
}

export function CtaSecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-md border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition-colors hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-500 dark:hover:bg-stone-800"
    >
      {children}
    </Link>
  );
}

export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="font-mono text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">{value}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">{label}</div>
    </div>
  );
}

export function MarketingNav() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  // Signed-in visitors get a direct door into the app; render only after
  // mount so the persisted auth store cannot cause a hydration mismatch.
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const showDashboard = mounted && isAuthed;

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-indigo-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="EUREKA home">
          <EurekaMark className="h-7 w-7" />
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">EUREKA</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">
              Learn · Discover · Master
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-stone-900 dark:text-stone-100'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
              className="rounded-md p-2 text-stone-500 hover:bg-stone-200/70 dark:text-stone-400 dark:hover:bg-stone-800"
            >
              <i className={`fas ${resolvedTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden />
            </button>
          )}
          {showDashboard ? (
            <Link
              href="/dashboard"
              className="hidden rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 md:inline-block"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-sm font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 md:inline"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="hidden rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 md:inline-block"
              >
                Join for free
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-stone-600 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'} text-lg`} aria-hidden />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950 lg:hidden">
          <nav className="space-y-1 px-4 py-3" aria-label="Mobile">
            {(showDashboard ? [{ label: 'Dashboard', href: '/dashboard' }] : [])
              .concat(NAV)
              .concat(showDashboard ? [] : [{ label: 'Log in', href: '/auth/login' }])
              .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200/60 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                {item.label}
              </Link>
            ))}
            {!showDashboard && (
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-md bg-indigo-700 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Join for free
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

const FOOTER_COLS: { title: string; links: [string, string][] }[] = [
  {
    title: 'Programs',
    links: [
      ['All programs', '/programs'],
      ['Patent Bar', '/programs/patent-bar'],
      ['Test Preparation', '/programs/test-prep'],
      ['Mathematics', '/programs/mathematics'],
      ['Engineering', '/programs/electronic-photonic-devices'],
      ['Medical Education', '/programs/medical-education'],
    ],
  },
  {
    title: 'Platform',
    links: [
      ['Open the dashboard', '/dashboard'],
      ['How we teach', '/methods'],
      ['Outcomes', '/outcomes'],
      ['Browse the catalogue', '/explore'],
      ['For institutions', '/institutions'],
      ['Pricing', '/#pricing'],
      ['System status', '/system-status'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Support', '/support'],
      ['Contact', '/contact'],
      ['Help center', '/help'],
      ['Community', '/community'],
      ['Blog', '/blog'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-900/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="EUREKA home">
              <EurekaMark className="h-7 w-7" />
              <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">EUREKA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-stone-600 dark:text-stone-400">
              Educational Universal Reasoning &amp; Enhanced Knowledge Architecture. Adaptive courses,
              graded practice, and a personal AI tutor — from high school to professional licensure.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={href + label}>
                    <Link
                      href={href}
                      className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-stone-200 pt-6 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EUREKA. All rights reserved.</p>
          <p>SSO / SAML · LTI 1.3 · FERPA · COPPA · HIPAA controls for institutions.</p>
        </div>
      </div>
    </footer>
  );
}

// CTA band used at the foot of most marketing pages.
export function CtaBand({
  title = 'Tell us where you are trying to get',
  desc = 'An exam date, a degree, a subject you want to own — start free and the platform maps the path. Institutions: we deploy with SSO, LTI and full compliance controls.',
}: {
  title?: string;
  desc?: string;
}) {
  return (
    <section className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{title}</h2>
          <p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-400">{desc}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaPrimary href="/auth/register">Join for free</CtaPrimary>
            <CtaSecondary href="/programs">Browse the programs</CtaSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}

// Shared page-hero for interior marketing pages.
export function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
        <Kicker>{kicker}</Kicker>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">{lead}</p>
        {children}
      </div>
    </section>
  );
}
