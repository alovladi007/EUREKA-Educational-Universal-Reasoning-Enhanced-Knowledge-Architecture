'use client';

import Link from 'next/link';
import HelpWidget from '@/components/HelpWidget';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CalendarDays,
  BarChart3,
  BookOpen,
  ClipboardList,
  Compass,
  FlaskConical,
  LayoutDashboard,
  Layers,
  Menu,
  PencilRuler,
  Route,
} from 'lucide-react';
import {
  EUREKA_LOGIN_URL,
  TOKEN_CLEARED_EVENT,
  TOKEN_STORAGE_KEY,
  getToken,
} from '@/lib/api';

// Shared chrome for the OCTET pages. Nothing here fetches: every page owns its
// own data loading, and these pieces only render what they are handed.
//
// This lives under app/_ui rather than components/ because components/ holds
// the Phase 3 visualization work, which is authored separately.

// The octet mark: a nucleus holding eight electrons in four Lewis pairs.
// Drawn inline rather than shipped as an asset so it inherits the tile's
// currentColor and needs no extra request. This is the platform's name as a
// picture - the octet rule is the first thing the course teaches.
export function OctetMark({ className = 'h-5 w-5' }: { className?: string }) {
  const pairs: Array<[number, number]> = [
    [12.4, 5.2], [19.6, 5.2],   // top pair
    [26.8, 12.4], [26.8, 19.6], // right pair
    [19.6, 26.8], [12.4, 26.8], // bottom pair
    [5.2, 19.6], [5.2, 12.4],   // left pair
  ];
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="5.4"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      {pairs.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.1" fill="currentColor" />
      ))}
    </svg>
  );
}

export function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white"
      >
        <OctetMark className="h-6 w-6" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-foreground">
          OCTET
        </span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Chemistry on EUREKA
        </span>
      </span>
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
          href={`${EUREKA_LOGIN_URL}?next=${encodeURIComponent('/launch/octet')}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Sign in with EUREKA
        </a>
      </div>
    </main>
  );
}

type GateState = 'checking' | 'ready' | 'signed-out';

// AuthGate settles the token question before any page renders. On mount it
// reads the token, which also captures and strips a token handed over in the
// URL hash. With a token the page renders. Without one the learner sees the
// sign-in prompt instead of a wall of failed requests.
//
// It also listens for a token being discarded, which is what happens when a
// request comes back 401 because the token expired. Settling only at mount was
// not enough: a session that expired while the tab was open left the learner
// on a page that looked live while every request behind it failed, with the
// reason visible only in the browser console. Expiry is normal and the honest
// response is to say so and offer the way back.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>('checking');

  useEffect(() => {
    setState(getToken() ? 'ready' : 'signed-out');

    const onCleared = () => setState('signed-out');
    window.addEventListener(TOKEN_CLEARED_EVENT, onCleared);
    // Another tab signing out clears the same storage key.
    const onStorage = (event: StorageEvent) => {
      if (event.key === TOKEN_STORAGE_KEY && !event.newValue) {
        setState('signed-out');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(TOKEN_CLEARED_EVENT, onCleared);
      window.removeEventListener('storage', onStorage);
    };
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

// The navigation set, in one place so a surface added later is reachable from
// every page. Order is the order a learner meets them: read, then attempt,
// then see the route, then look things up, then experiment.
const NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Practice', href: '/practice', icon: PencilRuler },
  { name: 'Review', href: '/review', icon: Layers },
  { name: 'Exams', href: '/exams', icon: ClipboardList },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Path', href: '/path', icon: Route },
  { name: 'Planner', href: '/planner', icon: CalendarDays },
  { name: 'Explore', href: '/explore', icon: Compass },
  { name: 'Simulations', href: '/simulations', icon: FlaskConical },
];

// The left sidebar, matching the EUREKA shell so crossing between the platform
// and this vertical does not feel like arriving at a different product. The
// active item is decided by the pathname rather than by each page declaring
// itself, because a page that has to remember to say where it is eventually
// forgets.
//
// onNavigate fires when a nav link is clicked, so the mobile slide-over can
// close itself after the learner picks a destination. It is a no-op on
// desktop, where the sidebar is always visible.
export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname() ?? '';

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <Link
          href="/dashboard"
          aria-label="OCTET home"
          className="rounded-md transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Wordmark />
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav className="space-y-1 p-4">
          {NAV.map((item) => {
            // Dashboard would otherwise match every route, since every path
            // starts with a slash.
            const active =
              item.href === '/dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  active
                    ? 'bg-brand-500 text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <a
          href={EUREKA_LOGIN_URL.replace(/\/auth\/login$/, '/dashboard')}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          Back to EUREKA
        </a>
      </div>
    </aside>
  );
}

// The standard page frame: sidebar on the left, scrolling content beside it.
// Navigation lives in the sidebar alone, so no page declares its own links and
// no two navigations can disagree about where the learner is.
//
// Below the md breakpoint the fixed 256px sidebar would crush the content to a
// column too narrow to read (a review measured 119px, one word per line), so
// there the sidebar becomes a slide-over behind a hamburger in a slim top bar.
// Desktop is unchanged: the sidebar is always present and there is no top bar.
export function Page({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">OCTET</span>
        </div>
        <main className="min-w-0 flex-1 overflow-y-auto">
          {/* Full width beside the sidebar, matching EUREKA's dashboard shell.
              A max-w-5xl cap here used to squeeze every page to 1024px — on a
              wide display a third of the screen was empty margin, and the
              chapter reader's rail + companion columns had to fit INSIDE the
              cap, pinching the prose. Reading measure is now the reader's own
              job (it caps its text column), not the shell's. */}
          <div className="px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </main>
      </div>

      {/* The platform helper. In the shell rather than per-page, so there is
          no surface inside OCTET where someone is stuck with no way to ask -
          which is how it shipped the first time, mounted only in EUREKA. */}
      <HelpWidget />
    </div>
  );
}

/**
 * A padding class in the caller's className, if there is one.
 *
 * "p-5 ... p-4" in one class attribute does NOT resolve to p-4: both
 * utilities have the same specificity, so the winner is whichever Tailwind
 * emitted later in the stylesheet, which is p-5. Every Stat tile and Entry
 * card was therefore rendering at 20px rather than the 14/16px the prep test
 * module uses. Found by measuring it in the browser; the source reads as
 * though the override works.
 */
const HAS_PADDING = /(^|\s)p-[\d.]+(\s|$)/;

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pad = HAS_PADDING.test(className) ? '' : 'p-5 ';
  return (
    <div
      className={`rounded-xl border border-border bg-card ${pad}shadow-sm ${className}`}
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

// -------------------------------------------------------------------------
// Module primitives
// -------------------------------------------------------------------------
//
// Lifted from the prep test modules (eureka/apps/web/src/components/test-prep/
// ExamDashboard.tsx) so OCTET and a prep test read as one product rather than
// two. They live here rather than in whichever page needed them first: every
// surface still to be converted wants the same three, and a primitive copied
// into nine files drifts in nine directions.
//
// This is a component library, not the navigation shell. Routes and the
// sidebar are unchanged - the prep test itself keeps 17 real routes and uses
// tabs only for light surfaces sharing one context, so OCTET's routes are
// already the shape that module arrived at.

// A recorded figure.
//
// `value` is mono tabular because these are read down a column and
// proportional digits do not line up. Pass an em dash plus a hint saying why
// when there is nothing to report: a zero claims a measurement was taken and
// came back zero, which is a different and usually false statement.
export function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="p-3.5">
      <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-mono text-2xl font-bold leading-none tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </Card>
  );
}

// A place to go, saying what it is FOR rather than only naming it. The whole
// card is the target, so the border lights on hover rather than the title.
export function Entry({
  href,
  icon,
  title,
  body,
  foot,
  accent = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  foot: React.ReactNode;
  // Marks the one card on a surface that is further along than the rest.
  // Deliberately at most one: an accent on everything accents nothing.
  accent?: boolean;
}) {
  return (
    <Link href={href} className="group block">
      <Card
        className={`h-full p-4 transition-colors ${
          accent
            ? 'border-brand-500 group-hover:border-brand-600'
            : 'group-hover:border-brand-500'
        }`}
      >
        <div className="mb-1.5 flex items-center gap-2 text-brand-600 dark:text-brand-400">
          {icon}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">{foot}</div>
      </Card>
    </Link>
  );
}

// A small fact on an Entry's foot: how much is there, how far along it is.
export function Tag({
  children,
  tone = 'muted',
}: {
  children: React.ReactNode;
  tone?: 'muted' | 'brand';
}) {
  return (
    <span
      className={
        tone === 'brand'
          ? 'rounded bg-brand-500/12 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300'
          : 'font-mono text-[11px] text-muted-foreground'
      }
    >
      {children}
    </span>
  );
}

// A titled group with an optional action on the right.
export function Band({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// The band every module surface opens with: name, one line saying what the
// surface is for, and nothing else. text-3xl matches the prep test exam pages.
export function PageHeader({
  title,
  lead,
  right,
}: {
  title: string;
  lead: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-3xl text-muted-foreground">{lead}</p>
      </div>
      {right}
    </header>
  );
}
