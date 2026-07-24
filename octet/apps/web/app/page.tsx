'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';

// The root has no content of its own: the dashboard is the entry point.
//
// This redirects on the client rather than with a server redirect, because
// EUREKA opens OCTET with the token in the URL hash. A hash never reaches the
// server, so capturing it here first and then navigating keeps the handoff
// under our control instead of relying on the browser carrying a fragment
// across an HTTP redirect.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Reading the token is what captures a handoff from the hash and strips it.
    getToken();
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Opening OCTET.</p>
    </main>
  );
}
