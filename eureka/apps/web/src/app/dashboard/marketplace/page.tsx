"use client";

/**
 * Legacy /dashboard/marketplace duplicated the real Phase 10 marketplace and
 * pointed at a non-existent microservice on :8050. The actual marketplace
 * lives at /marketplace. Following the same pattern as
 * /dashboard/graduate/page.tsx, this page just redirects.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LegacyMarketplaceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/marketplace");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Moved to the new marketplace
        </h1>
        <p className="text-slate-600">
          The old dashboard marketplace was a hardcoded mock pointing at a
          microservice that doesn&apos;t exist. The real Phase 10 marketplace
          lives at{" "}
          <Link href="/marketplace" className="text-amber-700 underline">
            /marketplace
          </Link>
          . Redirecting you now…
        </p>
        <p className="text-xs text-slate-400">
          If you aren&apos;t redirected automatically, click the link above.
        </p>
      </div>
    </div>
  );
}
