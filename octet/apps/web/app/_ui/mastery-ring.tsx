// A small progress ring for a course or unit header.
//
// The ring is decoration. The number is the content, so the number is always
// present as text: the svg is aria-hidden and a visually hidden sentence
// carries the same fact to a screen reader. Under WCAG 2.1 AA a progress
// indicator may not be the only carrier of its own state, and a ring with no
// text equivalent is exactly that failure.
//
// It reports a count over a total, never a percentage on its own, because
// "0 of 9 mastered" is a fact and "0%" reads like a score.

export function MasteryRing({
  mastered,
  total,
  label,
  size = 30,
}: {
  mastered: number;
  total: number;
  // Overrides the visually hidden sentence. Use it when mastery is not
  // recorded yet and a count would imply a measurement that was never taken.
  label?: string;
  size?: number;
}) {
  const safeTotal = total > 0 ? total : 0;
  const safeMastered = Math.min(Math.max(mastered, 0), safeTotal);
  const fraction = safeTotal > 0 ? safeMastered / safeTotal : 0;

  // viewBox units, so the geometry does not change when size does.
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * fraction;

  return (
    <span className="inline-flex shrink-0 items-center">
      <svg
        aria-hidden="true"
        focusable="false"
        width={size}
        height={size}
        viewBox="0 0 36 36"
      >
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          strokeWidth="4"
          className="stroke-border"
        />
        {filled > 0 && (
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            transform="rotate(-90 18 18)"
            className="stroke-brand-500"
          />
        )}
      </svg>
      <span className="sr-only">
        {label ?? `${safeMastered} of ${safeTotal} mastered`}
      </span>
    </span>
  );
}

export default MasteryRing;
