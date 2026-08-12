'use client';

/**
 * AXIOM's module vocabulary.
 *
 * The same primitives the Patent Bar prep-test module is built from
 * (eureka/apps/web/src/components/test-prep/ExamDashboard.tsx), and the same
 * ones OCTET was converted onto, so the three modules read as one product:
 * Card at p-3.5/p-4, mono tabular figures, group-hover:border-brand on a
 * whole-card target, an em dash plus a reason where there is no data.
 *
 * This is deliberately a separate file from PageShell.tsx, which owns the
 * chrome (wordmark, nav header, sign-in screen). These are page furniture.
 * PageShell already exports a `PageHeader` and it is the nav bar, not this -
 * hence `PageHeading` below, rather than a name collision resolved by import
 * order.
 */

import Link from 'next/link';

/**
 * A padding class in the caller's className, if there is one.
 *
 * Card carries a default padding, and "p-5 ... p-4" in one class attribute
 * does NOT resolve to p-4: both utilities have the same specificity, so the
 * winner is whichever Tailwind emitted later in the stylesheet, which is p-5.
 * Every Stat tile and Entry card was therefore rendering at 20px instead of
 * the 14/16px the prep test module uses - measured in the browser, not read
 * off the source, because the source looks correct.
 *
 * So the default is dropped when the caller supplies its own.
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

/**
 * The band every module surface opens with: name, one line saying what the
 * surface is for, and nothing else.
 */
export function PageHeading({
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-muted-foreground">{lead}</p>
      </div>
      {right}
    </header>
  );
}

/** A titled group with an optional action on the right. */
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
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * A recorded figure.
 *
 * `value` is mono tabular because these are read down a column and
 * proportional digits do not line up. Pass an em dash plus a hint saying why
 * when there is nothing to report: a zero claims a measurement was taken and
 * came back zero, which is a different and usually false statement.
 */
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
      <p className="font-mono text-2xl font-bold leading-none tabular-nums text-foreground">
        {value}
      </p>
      {hint && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
    </Card>
  );
}

/**
 * A place to go, saying what it is FOR rather than only naming it. The whole
 * card is the target, so the border lights on hover rather than the title.
 */
export function Entry({
  href,
  icon,
  title,
  body,
  foot,
  accent = false,
}: {
  href: string;
  icon?: React.ReactNode;
  title: string;
  body: string;
  foot?: React.ReactNode;
  // Marks the one card on a surface that is further along than the rest.
  // Deliberately at most one: an accent on everything accents nothing.
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
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
        {foot && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {foot}
          </div>
        )}
      </Card>
    </Link>
  );
}

/** A small fact on an Entry's foot: how much is there, how far along it is. */
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

/** A small coloured pill. The caller supplies the text and the tone. */
export function Pill({
  tone = 'neutral',
  children,
}: {
  tone?: 'green' | 'amber' | 'neutral' | 'brand';
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    green:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    neutral: 'bg-muted text-muted-foreground',
    brand: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-100',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/**
 * An honest empty state. Used wherever an endpoint legitimately returns
 * nothing. It never substitutes example content for real content.
 */
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
