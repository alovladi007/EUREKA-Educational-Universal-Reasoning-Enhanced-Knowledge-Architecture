"use client";

/**
 * Legacy /dashboard/institutions page redirected to the Phase 15 workforce
 * admin. The old page rendered hardcoded "Stanford / MIT / Harvard" cards
 * and called a non-existent microservice on :8100. The real platform now
 * lives at /institutions.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LegacyInstitutionsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/institutions");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Moved to the new workforce admin
        </h1>
        <p className="text-slate-600">
          The institutions page was retired in Phase 15. Redirecting you to{" "}
          <Link href="/institutions" className="text-amber-700 underline">
            /institutions
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
