"use client";

/**
 * Redirect: the bare /graduate route was the original learner page from
 * Phase 16.1 (pre-shell era — used <EurekaNav /> + amber styling). It's
 * been superseded by the in-shell /dashboard/graduate tree which is the
 * single source of truth for everything graduate (learner + admin +
 * research). Keep this thin redirect so old links / bookmarks / history
 * entries don't dead-end.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GraduateRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/graduate");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Graduate moved into the dashboard</h1>
        <p className="text-slate-600 text-sm">
          Your graduate work — enrollments, milestones, research workspaces,
          and (for admins) program management — now lives in one place at{" "}
          <Link href="/dashboard/graduate" className="text-primary underline">
            /dashboard/graduate
          </Link>
          . Redirecting you now…
        </p>
      </div>
    </div>
  );
}
