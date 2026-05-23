"use client";

/**
 * Redirect: /test-prep/pricing → /dashboard/test-prep/videos/pricing.
 * Companion to ../page.tsx — the video portal moved into the dashboard
 * tree as a sub-tab; this preserves the old subscription-pricing URL.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TestPrepPricingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/test-prep/videos/pricing");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Subscription pricing moved</h1>
        <p className="text-slate-600 text-sm">
          The video subscription plans now live at{" "}
          <Link
            href="/dashboard/test-prep/videos/pricing"
            className="text-primary underline"
          >
            /dashboard/test-prep/videos/pricing
          </Link>
          . Redirecting you now…
        </p>
      </div>
    </div>
  );
}
