'use client';

// Institution console overview, editorial edition. Same structure as before
// (a launcher into the eight tools) restyled in the storefront's language:
// kicker, large title, hairline module grid with monospace indices, and a
// governance-facts strip. All destinations unchanged.

import Link from 'next/link';

const MODULES = [
  {
    href: '/admin/users',
    title: 'Members',
    body: "Search your organization's people, assign roles, ban or reactivate accounts.",
    group: 'People',
  },
  {
    href: '/admin/cohorts',
    title: 'Cohorts',
    body: 'Cohort lifecycle, members, blueprints, at-risk early-warning.',
    group: 'People',
  },
  {
    href: '/admin/workforce',
    title: 'Workforce',
    body: 'Workforce development tracks and progress across your teams.',
    group: 'People',
  },
  {
    href: '/admin/integrations',
    title: 'SSO & LTI',
    body: 'Connect your identity provider (OIDC single sign-on) and LMS (LTI 1.3).',
    group: 'Platform',
  },
  {
    href: '/admin/jobs',
    title: 'Background jobs',
    body: 'Queue depth, recent runs, run-once trigger.',
    group: 'Platform',
  },
  {
    href: '/admin/audit',
    title: 'Audit log',
    body: 'Org-scoped security events with actor + subject + IP, filterable + CSV export.',
    group: 'Governance',
  },
  {
    href: '/admin/compliance',
    title: 'Data & compliance',
    body: "Fulfil data-subject requests — export or schedule deletion of a member's data.",
    group: 'Governance',
  },
  {
    href: '/admin/settings',
    title: 'Organization settings',
    body: 'Profile, contact details, and compliance posture (FERPA / COPPA / HIPAA).',
    group: 'Governance',
  },
];

const POSTURE: [string, string][] = [
  ['Access', 'org_admin / super_admin'],
  ['Identity', 'SSO / SAML · OIDC'],
  ['LMS', 'LTI 1.3'],
  ['Compliance', 'FERPA · COPPA · HIPAA'],
  ['Evidence', 'Audit log · CSV export'],
];

export default function AdminIndex() {
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
          Institution console
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Run EUREKA for your organization
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-400">
          People, platform and governance in one place. Every action here is org-scoped and lands
          in the audit log.
        </p>
      </div>

      {/* Governance posture strip */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 sm:grid-cols-3 lg:grid-cols-5">
        {POSTURE.map(([k, v]) => (
          <div key={k} className="bg-white px-4 py-3.5 dark:bg-stone-950">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
              {k}
            </dt>
            <dd className="mt-1 font-mono text-xs text-stone-800 dark:text-stone-200">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Module grid */}
      <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 md:grid-cols-2">
        {MODULES.map((m, i) => (
          <Link
            key={m.href}
            href={m.href}
            className="group flex flex-col bg-white p-7 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs text-stone-300 dark:text-stone-700">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                {m.group}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
              {m.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-400">{m.body}</p>
            <span className="mt-5 text-sm font-semibold text-indigo-700 dark:text-indigo-400">Open →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
