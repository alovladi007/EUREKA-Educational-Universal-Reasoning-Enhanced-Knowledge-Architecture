"use client";

/**
 * Redirect: bare /high-school → /dashboard/high-school.
 *
 * Defensive — mirrors the /graduate and /undergraduate top-level
 * redirects we shipped after a user kept landing on a stale page from
 * bookmark / URL bar muscle memory. No top-level high-school page
 * exists or has ever existed, but consistency across tiers matters.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HighSchoolRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/high-school");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">High School lives in the dashboard</h1>
        <p className="text-slate-600 text-sm">
          Your high-school work — tier enrollment, NGSS/CCSS/AP courses,
          recommendations, skill mastery, and resources — is all at{" "}
          <Link href="/dashboard/high-school" className="text-primary underline">
            /dashboard/high-school
          </Link>
          . Redirecting you now…
        </p>
      </div>
    </div>
  );
}
