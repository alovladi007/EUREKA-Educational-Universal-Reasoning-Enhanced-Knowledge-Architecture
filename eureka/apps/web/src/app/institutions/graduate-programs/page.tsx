"use client";

/**
 * Redirect: graduate-program administration has moved INTO the dashboard
 * shell at /dashboard/graduate/admin so there's a single navigation
 * experience for everything graduate. The old /institutions/graduate-programs
 * lived in the L&D admin shell (amber sidebar) which crossed over with
 * the learner-side /dashboard/graduate — that duplication was confusing
 * and is now consolidated under one tree.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GraduateProgramsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/graduate/admin");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Moved to the unified graduate console</h1>
        <p className="text-slate-600 text-sm">
          Graduate-program management now lives in the main dashboard at{" "}
          <Link href="/dashboard/graduate/admin" className="text-primary underline">
            /dashboard/graduate/admin
          </Link>{" "}
          alongside learner enrollments, research workspaces, and milestones —
          one navigation tree instead of two. Redirecting you now…
        </p>
      </div>
    </div>
  );
}
