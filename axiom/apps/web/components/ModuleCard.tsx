import Link from 'next/link';
import type { Module } from '@/lib/api';

// Maps an available module key to the route it opens. Keys not in this map are
// treated as not-yet-routed and render as a static card even if the API marks
// them available, so we never link to a page that does not exist.
const ROUTE_BY_KEY: Record<string, string> = {
  learn: '/learn',
  practice: '/practice',
  assess: '/teacher',
  remediate: '/path',
  mastery: '/mastery',
  analytics: '/analytics',
};

// A single module tile on the dashboard. Planned modules are visibly labeled
// "Planned" so the empty state stays honest - no faked data. Available modules
// with a known route render as a clickable link.
export function ModuleCard({ module }: { module: Module }) {
  const isPlanned = module.status === 'planned';
  const href = !isPlanned ? ROUTE_BY_KEY[module.key] : undefined;

  const body = (
    <>
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-card-foreground">
          {module.name}
        </h3>
        {isPlanned ? (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Planned
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-200">
            Available
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {module.description}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-col rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        {body}
        <span className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-300">
          Open {module.name}
        </span>
      </Link>
    );
  }

  return (
    <div
      className={`flex flex-col rounded-lg border border-border bg-card p-5 transition-shadow ${
        isPlanned ? 'opacity-80' : 'hover:shadow-md'
      }`}
    >
      {body}
    </div>
  );
}
