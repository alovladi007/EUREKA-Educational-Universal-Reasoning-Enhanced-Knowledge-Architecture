"use client";

/**
 * Redirect: /xr-labs → /dashboard/xr-labs.
 *
 * The 553-line XR Labs experience-list implementation that used to live
 * here had a self-consistent /xr-labs/* link tree but the sidebar
 * canonically points at /dashboard/xr-labs (Phase 19, the real-data
 * version). The only route this tree had that wasn't already in
 * /dashboard/xr-labs/ was experience/[id]/ — that's been migrated over
 * with its internal "Back to XR Labs" links updated to /dashboard/xr-labs.
 *
 * Also gone (deleted, not preserved): page-old-backup.tsx (958-line
 * literal backup file with no purpose).
 *
 * Original 553-line page archived in git history.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function XRLabsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/xr-labs");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">XR Labs moved</h1>
        <p className="text-slate-600 text-sm">
          The XR Labs experience list now lives at{" "}
          <Link href="/dashboard/xr-labs" className="text-primary underline">
            /dashboard/xr-labs
          </Link>{" "}
          with the rest of your dashboard. Redirecting you now…
        </p>
      </div>
    </div>
  );
}
