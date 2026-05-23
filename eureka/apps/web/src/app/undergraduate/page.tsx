"use client";

/**
 * Redirect: bare /undergraduate → /dashboard/undergraduate.
 *
 * Defensive — there is no top-level undergraduate page (and never was),
 * but we shipped a redirect for the analogous /graduate route after a
 * user kept landing on a stale Phase 16.1 page from bookmark / history,
 * so mirror the same hygiene here in case anyone has /undergraduate in
 * their URL bar muscle memory.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UndergraduateRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/undergraduate");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Undergraduate lives in the dashboard</h1>
        <p className="text-slate-600 text-sm">
          Your undergrad work — tier enrollment, courses, recommendations,
          skill mastery, and resources — is all in one place at{" "}
          <Link href="/dashboard/undergraduate" className="text-primary underline">
            /dashboard/undergraduate
          </Link>
          . Redirecting you now…
        </p>
      </div>
    </div>
  );
}
