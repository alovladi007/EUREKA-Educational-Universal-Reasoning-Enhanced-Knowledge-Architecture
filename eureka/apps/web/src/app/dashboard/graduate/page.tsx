"use client";

/**
 * Legacy /dashboard/graduate page redirected to the Phase 16.1 graduate
 * surface. The old page rendered hardcoded "Dr. Sarah Johnson (Advisor)",
 * "PhD Dissertation Progress 45%", fake Teaching Assistantship cards, etc.
 * and called a non-existent microservice on :8012 (tier-grad).
 *
 * Per the 2026-05 design decision, the new graduate tier (Phase 16.1) has
 * no advisors / no committees — each enrollment has a single optional
 * supervisor_user_id, and milestones replace the bespoke "Literature Review
 * → Proposal Defense → Data Collection → Final Defense" progress bar.
 * The real platform lives at /graduate.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LegacyGraduateRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/graduate");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Moved to the new graduate dashboard
        </h1>
        <p className="text-slate-600">
          The old graduate-school page was a hardcoded mock. Phase 16.1 ships a
          real one wired to the API. Redirecting you to{" "}
          <Link href="/graduate" className="text-amber-700 underline">
            /graduate
          </Link>{" "}
          now…
        </p>
        <p className="text-xs text-slate-400">
          If you aren&apos;t redirected automatically, click the link above.
        </p>
      </div>
    </div>
  );
}
