'use client';

// Institution console shell, editorial edition. Same warm-paper surfaces,
// ink text, single indigo accent, letterspaced kickers and hairline rules as
// the marketing site — the console should feel like the same product the
// storefront promised. Functionality unchanged: ProtectedRoute still guards
// with org_admin/super_admin, and all nine tools keep their routes.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { EurekaMark } from '@/components/eureka-logo';
import { useAuthStore } from '@/stores/auth';
import { getUserDisplayName } from '@/lib/utils';

const NAV_GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: 'Console',
    items: [{ href: '/admin', label: 'Overview' }],
  },
  {
    title: 'People',
    items: [
      { href: '/admin/users', label: 'Members' },
      { href: '/admin/cohorts', label: 'Cohorts' },
      { href: '/admin/workforce', label: 'Workforce — partner portal ↗' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/admin/integrations', label: 'SSO & LTI' },
      { href: '/admin/jobs', label: 'Background jobs' },
    ],
  },
  {
    title: 'Governance',
    items: [
      { href: '/admin/audit', label: 'Audit log' },
      { href: '/admin/compliance', label: 'Data & compliance' },
      { href: '/admin/settings', label: 'Settings' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const user = useAuthStore((s) => s.user);

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'));

  return (
    <ProtectedRoute allowedRoles={['org_admin', 'super_admin']}>
      <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        {/* Console header */}
        <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5" aria-label="EUREKA home">
                <EurekaMark className="h-7 w-7" />
                <span className="text-lg font-bold tracking-tight">EUREKA</span>
              </Link>
              <span className="hidden h-5 w-px bg-stone-300 dark:bg-stone-700 sm:block" aria-hidden />
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400 sm:block">
                Institution console
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {mounted && (
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle dark mode"
                  className="rounded-md p-2 text-stone-500 hover:bg-stone-200/70 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  <i className={`fas ${resolvedTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden />
                </button>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="hidden text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 sm:block"
              >
                {user ? getUserDisplayName(user) : 'Account'}
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:gap-14 lg:px-8">
          {/* Rail */}
          <aside className="h-fit lg:sticky lg:top-24">
            <nav aria-label="Console sections" className="space-y-7">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                    {group.title}
                  </p>
                  <ul className="mt-2.5 border-l border-stone-200 dark:border-stone-800">
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                              active
                                ? 'border-indigo-700 font-semibold text-stone-900 dark:border-indigo-400 dark:text-stone-100'
                                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-100'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 space-y-8 pb-16">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
