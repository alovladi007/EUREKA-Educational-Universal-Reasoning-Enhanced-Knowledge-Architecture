'use client';

/**
 * Root-level error boundary (Next App Router convention).
 *
 * Catches any uncaught render error outside the /dashboard subtree —
 * e.g. marketing pages, auth flows, the landing page. Renders the
 * same ErrorScreen as the dashboard boundary so the visual treatment
 * is consistent platform-wide.
 *
 * Note: this does NOT replace Next's `global-error.tsx`, which would
 * catch errors in the root layout itself. That's a separate file with
 * a different signature (must render its own <html>/<body>).
 */

import ErrorScreen from '@/components/error/ErrorScreen';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorScreen
      error={error}
      reset={reset}
      fallbackHref="/"
      fallbackLabel="Back to home"
    />
  );
}
