// A labeled, accessible progress bar. value is a fraction in [0, 1] and is
// rendered as a percentage. Used by the mastery and path views to show
// p_known without fabricating anything - the number comes straight from the
// API.

function clampFraction(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

export function toPercent(value: number): number {
  return Math.round(clampFraction(value) * 100);
}

export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const pct = toPercent(value);
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label ? `${label}: ${pct} percent` : `${pct} percent`}
    >
      <div
        className="h-full rounded-full bg-brand-600 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
