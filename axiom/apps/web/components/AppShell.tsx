'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchUnreadCount, getToken } from '@/lib/api';
import { Wordmark } from '@/components/PageShell';

// The persistent application shell: a fixed left sidebar listing every module,
// with the page content rendered on the right. It replaces the old per-page
// top-bar navigation so the same nav is present on every page.
//
// Layout: the shell is exactly the viewport height and hides its own overflow;
// the sidebar and the content each have their own vertical scroll. This keeps
// every sidebar link reachable and clickable no matter how tall the nav or the
// page content is (the earlier sticky-plus-viewport-height approach could leave
// the lowest links unclickable on short screens).

// A single navigation group: a small uppercase heading and its links.
interface NavGroup {
  heading: string;
  links: { href: string; label: string }[];
}

// Dashboard sits on its own at the top of the sidebar, above the grouped
// modules (no "Overview" heading, so nothing is labeled twice).
const DASHBOARD_LINK = { href: '/dashboard', label: 'Dashboard' };

// The module groups shown in the sidebar, top to bottom. The first group is
// named "Study" rather than "Learn" so it does not collide with the "Learn"
// module link inside it.
const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Study',
    links: [
      { href: '/learn', label: 'Learn' },
      { href: '/practice', label: 'Practice' },
      { href: '/review', label: 'Review' },
      { href: '/mastery', label: 'Mastery' },
      { href: '/path', label: 'Path' },
      { href: '/cat', label: 'Adaptive test' },
    ],
  },
  {
    heading: 'Engage',
    links: [
      { href: '/assessments', label: 'Assessments' },
      { href: '/achievements', label: 'Achievements' },
      { href: '/copilot', label: 'Copilot' },
      { href: '/tutor', label: 'Live tutoring' },
      { href: '/notifications', label: 'Notifications' },
    ],
  },
  {
    heading: 'Teaching',
    links: [
      { href: '/teacher', label: 'Teacher console' },
      { href: '/studio', label: 'Content Studio' },
      { href: '/analytics', label: 'Analytics' },
      { href: '/grading-review', label: 'Grading review' },
      { href: '/proctoring', label: 'Proctoring review' },
      { href: '/integrations', label: 'Integrations' },
    ],
  },
];

// A small rounded pill showing the live unread notification count. Rendered
// only when the count is positive.
function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }
  return (
    <span className="ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-xs font-medium text-white">
      {count}
    </span>
  );
}

// A single sidebar navigation link. The active link (an exact pathname match)
// is highlighted with the brand tokens; every other link is muted with a hover
// background. Each link carries a keyboard focus ring.
function NavLink({
  href,
  label,
  active,
  unreadCount,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  unreadCount: number;
  onNavigate?: () => void;
}) {
  const isNotifications = href === '/notifications';
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
        active
          ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-200'
          : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      <span className="truncate">{label}</span>
      {isNotifications && <UnreadBadge count={unreadCount} />}
    </Link>
  );
}

// The sidebar body: the wordmark and the grouped navigation. Rendered both in
// the persistent md+ column and inside the mobile drawer, so the navigation
// markup lives here once. onNavigate is called when a link is followed, which
// the mobile drawer uses to close itself.
function SidebarNav({
  pathname,
  unreadCount,
  onNavigate,
}: {
  pathname: string;
  unreadCount: number;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label="AXIOM home"
      >
        <Wordmark />
      </Link>

      <nav className="flex flex-col gap-5" aria-label="Modules">
        <div className="flex flex-col gap-0.5">
          <NavLink
            href={DASHBOARD_LINK.href}
            label={DASHBOARD_LINK.label}
            active={pathname === DASHBOARD_LINK.href}
            unreadCount={unreadCount}
            onNavigate={onNavigate}
          />
        </div>
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="mb-1.5 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.heading}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={pathname === link.href}
                  unreadCount={unreadCount}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Best-effort unread count for the Notifications badge. Fetched once on mount;
  // rendered as nothing extra on failure, and skipped entirely when signed out.
  useEffect(() => {
    if (!getToken()) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchUnreadCount();
        if (!cancelled) {
          setUnreadCount(result.count);
        }
      } catch {
        // Tolerate failure silently; the sidebar renders without a badge.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Persistent sidebar (md and up): its own scroll region, always
          clickable regardless of viewport height. */}
      <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-border bg-card md:block">
        <SidebarNav pathname={pathname} unreadCount={unreadCount} />
      </aside>

      {/* Main column: mobile top bar plus the scrollable content region. */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
          <Link
            href="/dashboard"
            className="rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="AXIOM home"
          >
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="app-shell-drawer"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Menu
          </button>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
      </div>

      {/* Mobile drawer overlay (below md). */}
      {open && (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-foreground/40"
          />
          <aside
            id="app-shell-drawer"
            className="absolute inset-y-0 left-0 w-64 max-w-[80%] overflow-y-auto border-r border-border bg-card shadow-lg"
          >
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                Close
              </button>
            </div>
            <SidebarNav
              pathname={pathname}
              unreadCount={unreadCount}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
