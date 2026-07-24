'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EUREKA_LOGIN_URL, getToken } from '@/lib/api';

// Shared chrome for the OCTET pages. Nothing here fetches: every page owns its
// own data loading, and these pieces only render what they are handed.
//
// This lives under app/_ui rather than components/ because components/ holds
// the Phase 3 visualization work, which is authored separately.

export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white"
      >
        O
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          OCTET
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Chemistry on EUREKA
        </span>
      </div>
    </div>
  );
}

// Shown when no token has been handed over. This is the honest state, not an
// error: OCTET owns no accounts, so signing in happens on EUREKA and the
// learner comes back here with a token in the URL hash.
export function SignInScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-6 flex justify-center">
          <Wordmark />
        </div>
        <h1 className="mb-2 text-lg font-semibold text-card-foreground">
          Sign in through EUREKA to continue
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          OCTET uses your EUREKA account. Sign in on EUREKA and you will be
          returned here with access to the chemistry workspace.
        </p>
        <a
          href={EUREKA_LOGIN_URL}
          className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Sign in with EUREKA
        </a>
      </div>
    </main>
  );
}

type GateState = 'checking' | 'ready' | 'signed-out';

// AuthGate settles the token question once, before any page renders. On mount
// it reads the token, which also captures and strips a token handed over in the
// URL hash. With a token the page renders. Without one the learner sees the
// sign-in prompt instead of a wall of failed requests.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>('checking');

  useEffect(() => {
    setState(getToken() ? 'ready' : 'signed-out');
  }, []);

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading OCTET.</p>
      </main>
    );
  }

  if (state === 'signed-out') {
    return <SignInScreen />;
  }

  return <>{children}</>;
}

// A consistent secondary-navigation link.
export function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded px-2 py-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {children}
    </Link>
  );
}

// The full set of surfaces, in one place, so a page added later is reachable
// from every page that uses it. Pages that want a shorter nav still pass their
// own links into Page.
export function MainNav() {
  return (
    <>
      <HeaderLink href="/dashboard">Dashboard</HeaderLink>
      <HeaderLink href="/learn">Learn</HeaderLink>
      <HeaderLink href="/practice">Practice</HeaderLink>
      <HeaderLink href="/path">Path</HeaderLink>
      <HeaderLink href="/explore">Explore</HeaderLink>
      <HeaderLink href="/simulations">Simulations</HeaderLink>
    </>
  );
}

export function PageHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link
          href="/dashboard"
          className="rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="OCTET home"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-1 text-sm">{children}</nav>
      </div>
    </header>
  );
}

// The standard page frame: header, then a centered content column.
export function Page({
  nav,
  children,
}: {
  nav?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PageHeader>{nav}</PageHeader>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

export function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// An honest empty state. Used wherever an endpoint legitimately returns
// nothing. It never substitutes example content for real content.
export function EmptyState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
      <p className="text-sm font-medium text-card-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

export function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <h2 className="mb-1 text-base font-semibold text-red-800 dark:text-red-200">
        Something went wrong
      </h2>
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
      <p className="mt-3 text-sm text-red-700 dark:text-red-300">
        Check that the OCTET API is running on{' '}
        <code className="font-mono">localhost:8500</code>, then reload this
        page.
      </p>
    </div>
  );
}

// A small coloured pill. tone selects the palette; the caller supplies the
// text, so nothing here decides what counts as good or bad.
export function Pill({
  tone,
  children,
}: {
  tone: 'green' | 'red' | 'amber' | 'neutral' | 'brand';
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    green:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    amber:
      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    neutral: 'bg-muted text-muted-foreground',
    brand:
      'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-100',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

// Human-readable tier names. The API returns the code.
export const TIER_NAMES: Record<string, string> = {
  CF: 'Chemical Foundations',
  G1: 'General Chemistry 1',
  G2: 'General Chemistry 2',
};

export function tierName(tier: string): string {
  return TIER_NAMES[tier] || tier;
}

// Turn a thrown value into something a learner can read. ApiError already
// carries the API's own detail string, so this only has to handle the rest.
export function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return 'Unknown error.';
}
