'use client';

import { useEffect, useState } from 'react';
import { ensureSession } from '@/lib/api';
import { SignInScreen } from '@/components/PageShell';

// AuthGate provisions a session before the app renders. It first honors any
// token already present (including one handed over from EUREKA in the URL
// hash), and otherwise requests a local development session from the API. Only
// when neither is available (for example in production) does it fall back to
// the sign-in screen. Because children render only after a token exists, every
// page's own token check passes without a per-page change.

type GateState = 'checking' | 'ready' | 'signed-out';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>('checking');

  useEffect(() => {
    let cancelled = false;
    ensureSession().then((token) => {
      if (!cancelled) {
        setState(token ? 'ready' : 'signed-out');
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading AXIOM.</p>
      </main>
    );
  }

  if (state === 'signed-out') {
    return <SignInScreen />;
  }

  return <>{children}</>;
}
