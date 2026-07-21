'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EUREKA_LOGIN_URL, fetchUnreadCount, getToken } from '@/lib/api';
import { EurekaMark } from '@/components/eureka-mark';

// Shared chrome for the Phase 1 pages. It renders the AXIOM wordmark, a link
// back to the dashboard, and a slot for the page content. It does not fetch
// anything itself - each page owns its data loading.

export function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <EurekaMark className="h-8 w-8 shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-bold tracking-tight text-foreground">AXIOM</span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Learn. Discover. Master.
        </span>
      </div>
    </div>
  );
}

// The signed-out screen, matching the dashboard pattern.
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
          AXIOM uses your EUREKA account. Sign in on EUREKA and you will be
          returned here with access to the mathematics workspace.
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

// Read the token on the client. Returns null until the effect in the page has
// confirmed it, so callers should gate rendering on their own load state.
export function hasToken(): boolean {
  return getToken() !== null;
}

export function PageHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link
          href="/dashboard"
          className="rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="AXIOM home"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {children}
          <NotificationsBell />
        </nav>
      </div>
    </header>
  );
}

// A lightweight nav indicator rendered inside every PageHeader. On mount it
// makes a single unread-count request and, when the count is positive, shows it
// as a small badge beside a "Notifications" link. Failures are tolerated
// silently so the header never breaks, and it renders nothing when there is no
// token (so it is safe on the server and when signed out).
export function NotificationsBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchUnreadCount();
        if (!cancelled) {
          setCount(result.count);
        }
      } catch {
        // Tolerate failure silently; the link still works without a badge.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!getToken()) {
    return null;
  }

  return (
    <Link
      href="/notifications"
      className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      Notifications
      {count > 0 && (
        <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-xs font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

// A consistent secondary-navigation link used in page headers.
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

// A standard error panel, reused across pages.
export function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <h2 className="mb-1 text-base font-semibold text-red-800 dark:text-red-200">
        Something went wrong
      </h2>
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
      <p className="mt-3 text-sm text-red-700 dark:text-red-300">
        Check that the AXIOM API is running, then reload this page.
      </p>
    </div>
  );
}
