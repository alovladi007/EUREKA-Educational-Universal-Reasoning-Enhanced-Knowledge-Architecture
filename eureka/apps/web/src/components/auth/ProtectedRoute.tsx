'use client';

/**
 * Authentication gate.
 *
 * Wraps any privileged subtree (dashboard, admin, settings, institutions) so
 * that:
 *   • Unauthenticated users are redirected to /auth/login?next=<current-path>
 *   • Authenticated users with the wrong role are bounced to /dashboard
 *   • Children only render once we've confirmed there IS a session.
 *
 * Hydration discipline (avoids React #418/#423 + redirect flicker):
 *   - We never read localStorage during render. A `mounted` state gate keeps
 *     the server-rendered HTML and the first client paint identical.
 *   - We wait for `_hasHydrated` on the auth store (Zustand persist) before
 *     trusting `isAuthenticated`.
 *   - While waiting we render a clearly-labeled skeleton — no protected
 *     content leaks before the check completes.
 *
 * Token handling:
 *   - The login flow stores `access_token` in localStorage directly (see
 *     /app/auth/login/page.tsx). The dashboard layout calls `refreshUser()`
 *     on mount to revalidate that token against api-core and populate the
 *     zustand store.
 *   - So a fresh page load can have a valid token in localStorage but a
 *     not-yet-populated zustand user. We treat "token present" as a
 *     provisional pass — we won't redirect — and let refreshUser() resolve
 *     the user (or revoke the token and trigger our redirect on the next
 *     render).
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, the authenticated user must have a role from this list. */
  allowedRoles?: string[];
}

/**
 * P1.3b: client-side token validity gate.
 *
 * Previously the route trusted the mere PRESENCE of an `access_token`
 * string, so an expired or malformed token passed the render gate (the
 * server would later 401, but protected content had already mounted).
 * We can't verify the HS256 signature in the browser (no secret), but
 * we CAN decode the JWT payload and reject anything past `exp` or
 * structurally broken. The server still fully verifies every API call;
 * this just stops dead tokens from rendering the protected shell.
 *
 * Returns false (and clears the dead token) when the token is missing,
 * unparseable, or expired.
 */
function hasValidAccessToken(): boolean {
  try {
    const token = window.localStorage.getItem('access_token');
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) {
      window.localStorage.removeItem('access_token');
      return false;
    }
    // base64url → JSON payload.
    const json = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
    );
    const exp = typeof json.exp === 'number' ? json.exp : 0;
    // 30s skew guard, matching the fetch-wrapper's expiry check.
    if (!exp || exp - 30 <= Math.floor(Date.now() / 1000)) {
      window.localStorage.removeItem('access_token');
      return false;
    }
    return true;
  } catch {
    // Malformed token → clear it so the next render redirects cleanly.
    try { window.localStorage.removeItem('access_token'); } catch { /* ignore */ }
    return false;
  }
}

function AuthCheckSkeleton({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="space-y-3 text-center">
        <div
          className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname() || '/dashboard';

  const hydrated = useAuthStore((s) => s._hasHydrated);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Defer the localStorage read until after mount so SSR and the first
  // client render produce identical markup. Then keep `tokenPresent` in
  // state so this component re-renders if a parent triggers a refresh
  // that clears the token.
  const [mounted, setMounted] = useState(false);
  const [tokenPresent, setTokenPresent] = useState(false);

  useEffect(() => {
    setMounted(true);
    // P1.3b: validate the token (structure + expiry), not just presence.
    setTokenPresent(hasValidAccessToken());
  }, []);

  useEffect(() => {
    if (!mounted || !hydrated) return;

    // No session at all → bounce to login with a `next` so the user lands
    // back on the page they were trying to reach.
    if (!isAuthenticated && !tokenPresent) {
      const next = encodeURIComponent(pathname);
      router.replace(`/auth/login?next=${next}`);
      return;
    }

    // Authenticated but lacks the role required for this subtree → bounce
    // to the generic dashboard.
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [mounted, hydrated, isAuthenticated, tokenPresent, user, allowedRoles, router, pathname]);

  // 1) Wait for persist hydration + mount before deciding anything.
  if (!mounted || !hydrated) {
    return <AuthCheckSkeleton label="Checking your session…" />;
  }

  // 2) No session → keep showing the skeleton until the effect above
  //    completes the redirect. Prevents protected content from flashing.
  if (!isAuthenticated && !tokenPresent) {
    return <AuthCheckSkeleton label="Redirecting to sign in…" />;
  }

  // 3) Wrong role → same treatment.
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <AuthCheckSkeleton label="Redirecting…" />;
  }

  return <>{children}</>;
}
