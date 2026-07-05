import type { Module } from '@/lib/api';

// A single module tile on the dashboard. Planned modules are visibly
// labeled "Planned" so the empty state stays honest - no faked data.
export function ModuleCard({ module }: { module: Module }) {
  const isPlanned = module.status === 'planned';

  return (
    <div
      className={`flex flex-col rounded-lg border border-border bg-card p-5 transition-shadow ${
        isPlanned ? 'opacity-80' : 'hover:shadow-md'
      }`}
    >
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
    </div>
  );
}
