"use client";

/**
 * Legacy dashboard marketplace — the real Phase 10 marketplace lives at
 * /marketplace (top level). This page is just a redirect to keep any old
 * sidebar links / bookmarks working.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LegacyDashboardMarketplaceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/marketplace");
  }, [router]);
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Moved to the real marketplace</h1>
        <p className="text-muted-foreground">
          The legacy dashboard marketplace was a mock. The real Phase 10
          marketplace lives at{" "}
          <Link href="/marketplace" className="text-primary underline">
            /marketplace
          </Link>
          . Redirecting…
        </p>
      </div>
    </div>
  );
}
