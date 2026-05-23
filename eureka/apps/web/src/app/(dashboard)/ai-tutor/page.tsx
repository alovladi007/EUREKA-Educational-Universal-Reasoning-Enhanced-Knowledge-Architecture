"use client";

/**
 * Redirect: /ai-tutor → /dashboard/tutor.
 *
 * The 576-line implementation that used to live here was an abandoned
 * v1 of the AI tutor — nothing in the codebase linked to /ai-tutor (grep
 * confirmed: zero incoming hrefs / router.push references). The sidebar
 * canonically points at /dashboard/tutor (the smaller, Phase-12+ rewrite
 * — components/dashboard/sidebar.tsx line 49). Replacing the orphan
 * with a redirect to avoid the URL collision and keep any bookmarked
 * /ai-tutor links alive.
 *
 * Original 576-line page archived in git history (see this commit's
 * parent for the full source).
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AITutorRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/tutor");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">AI Tutor moved</h1>
        <p className="text-slate-600 text-sm">
          The AI tutor now lives at{" "}
          <Link href="/dashboard/tutor" className="text-primary underline">
            /dashboard/tutor
          </Link>{" "}
          with the rest of your dashboard. Redirecting you now…
        </p>
      </div>
    </div>
  );
}
