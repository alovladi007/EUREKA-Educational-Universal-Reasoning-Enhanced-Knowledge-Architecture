'use client';

/**
 * Error boundary for the entire /dashboard subtree (Next App Router
 * convention — auto-mounted by Next as the segment-level boundary).
 *
 * Anything thrown during render of /dashboard/* now lands here instead
 * of Next's default blank fallback. The sidebar/topbar remain visible
 * (they live in /dashboard/layout.tsx, which is outside the boundary)
 * so the user can navigate away without a hard reload.
 */

import ErrorScreen from '@/components/error/ErrorScreen';

export default function DashboardError({
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
      scope="This dashboard page"
      fallbackHref="/dashboard"
      fallbackLabel="Back to dashboard"
    />
  );
}
