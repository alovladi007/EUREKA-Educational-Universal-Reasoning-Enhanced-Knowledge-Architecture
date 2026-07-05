// A small live pill that reflects AXIOM API reachability.
//
// state:
//   "checking"    - the health probe is in flight
//   "healthy"     - GET /health succeeded
//   "unreachable" - the health probe failed

export type ApiHealthState = 'checking' | 'healthy' | 'unreachable';

const STYLES: Record<ApiHealthState, string> = {
  checking: 'bg-muted text-muted-foreground',
  healthy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  unreachable: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
};

const DOT: Record<ApiHealthState, string> = {
  checking: 'bg-muted-foreground',
  healthy: 'bg-emerald-500',
  unreachable: 'bg-red-500',
};

const LABEL: Record<ApiHealthState, string> = {
  checking: 'API: checking',
  healthy: 'API: healthy',
  unreachable: 'API: unreachable',
};

export function StatusPill({ state }: { state: ApiHealthState }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${STYLES[state]}`}
      aria-live="polite"
    >
      <span className={`h-2 w-2 rounded-full ${DOT[state]}`} aria-hidden="true" />
      {LABEL[state]}
    </span>
  );
}
