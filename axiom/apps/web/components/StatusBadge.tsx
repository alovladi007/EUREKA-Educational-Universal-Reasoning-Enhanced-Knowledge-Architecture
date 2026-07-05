// A small colored badge for a learning-path node status. Kept generic so it
// can also label a mastery level string. Unknown values fall back to a neutral
// style rather than erroring.

const STYLES: Record<string, string> = {
  available:
    'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200',
  mastered:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  locked: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? 'bg-muted text-muted-foreground';
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}
