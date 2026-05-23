"use client";

/**
 * Redirect: /test-prep → /dashboard/test-prep/videos.
 *
 * /test-prep used to be the subscription-gated video course portal (422
 * lines), distinct from /dashboard/test-prep (the adaptive QBank). The
 * two URLs were confusingly similar even though they served different
 * products. The video portal has been pulled into the test-prep
 * dashboard tree at /dashboard/test-prep/videos so both products are
 * now in one sub-nav. This redirect keeps existing /test-prep links /
 * bookmarks / external references working.
 *
 * Note: /test-prep-landing (the public marketing landing page) is
 * unaffected — it lives at a different URL.
 *
 * Original 422-line page archived in git history.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TestPrepVideosRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/test-prep/videos");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Test Prep Videos moved</h1>
        <p className="text-slate-600 text-sm">
          The video course portal is now a tab inside the test-prep dashboard
          at{" "}
          <Link
            href="/dashboard/test-prep/videos"
            className="text-primary underline"
          >
            /dashboard/test-prep/videos
          </Link>
          . Redirecting you now…
        </p>
      </div>
    </div>
  );
}
