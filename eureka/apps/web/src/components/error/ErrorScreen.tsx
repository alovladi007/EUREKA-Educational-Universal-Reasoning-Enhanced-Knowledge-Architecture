'use client';

/**
 * Shared error UI used by the Next App Router `error.tsx` segments
 * (`/error.tsx`, `/dashboard/error.tsx`, etc.).
 *
 * Renders a friendly retry surface instead of Next's default blank
 * screen. In production the stack is suppressed — only the error
 * message + digest are shown so a sanitised version reaches the user
 * but ops can correlate via the digest in server logs.
 *
 * Two primary affordances:
 *   - "Try again" calls the boundary's `reset` callback to re-render
 *     the failing segment without a full page reload.
 *   - "Go to dashboard" hard-navigates out, useful when the segment
 *     itself is unrecoverable (e.g. crashed during initial mount).
 */

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCw, Home, ChevronDown, ChevronRight } from 'lucide-react';

interface ErrorScreenProps {
  /** The Error thrown during render. Next attaches a `digest` field on
   *  server errors so we can correlate with the API logs. */
  error: Error & { digest?: string };
  /** Boundary-supplied reset — re-renders the failing segment. */
  reset: () => void;
  /** Optional context to help the user understand which area errored
   *  (e.g. "the Patent Bar Command Center"). */
  scope?: string;
  /** Where the "Go elsewhere" CTA navigates. Defaults to /dashboard. */
  fallbackHref?: string;
  /** Label for the fallback CTA. Defaults to "Go to dashboard". */
  fallbackLabel?: string;
}

export default function ErrorScreen({
  error,
  reset,
  scope,
  fallbackHref = '/dashboard',
  fallbackLabel = 'Go to dashboard',
}: ErrorScreenProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  const isDev = process.env.NODE_ENV !== 'production';

  // Best-effort console mirror so devs see the full error in console
  // even if the digest UI is collapsed. Next App Router already logs
  // to console.error on the server, but the client-side render gets
  // a stripped Error in prod.
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[ErrorScreen]', { scope, error });
  }, [error, scope]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white flex items-center justify-center shadow">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-rose-900 dark:text-rose-100">
              Something went wrong
            </h1>
            <p className="text-sm text-rose-700/90 dark:text-rose-200/90 mt-1">
              {scope
                ? `${scope} hit an unexpected error.`
                : 'This page hit an unexpected error.'}{' '}
              You can try again, or head back to the dashboard.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-4 py-2 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href={fallbackHref}
            className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm font-medium px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Home className="h-4 w-4" />
            {fallbackLabel}
          </Link>
        </div>

        {/* Diagnostics — message always visible, stack collapsed and
            dev-only. The digest is shown in prod so users can quote it
            to support; the full stack stays server-side. */}
        <div className="mt-6 rounded-xl border border-rose-200/70 dark:border-rose-800/60 bg-white/60 dark:bg-gray-950/40 overflow-hidden">
          <button
            onClick={() => setShowDetails((s) => !s)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-xs font-medium text-rose-900 dark:text-rose-100 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-colors"
            aria-expanded={showDetails}
          >
            <span>Technical details</span>
            {showDetails ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {showDetails && (
            <div className="px-4 py-3 border-t border-rose-200/70 dark:border-rose-800/60 space-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-rose-700/70 dark:text-rose-300/70 mb-0.5">
                  Message
                </p>
                <p className="text-xs font-mono break-words text-rose-900 dark:text-rose-100">
                  {error?.message || 'No message'}
                </p>
              </div>
              {error?.digest && (
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-rose-700/70 dark:text-rose-300/70 mb-0.5">
                    Digest (cite this when reporting)
                  </p>
                  <p className="text-xs font-mono break-all text-rose-900 dark:text-rose-100">
                    {error.digest}
                  </p>
                </div>
              )}
              {isDev && error?.stack && (
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-rose-700/70 dark:text-rose-300/70 mb-0.5">
                    Stack (dev only)
                  </p>
                  <pre className="text-[10px] font-mono whitespace-pre-wrap break-words text-rose-900/90 dark:text-rose-100/90 max-h-64 overflow-auto">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
