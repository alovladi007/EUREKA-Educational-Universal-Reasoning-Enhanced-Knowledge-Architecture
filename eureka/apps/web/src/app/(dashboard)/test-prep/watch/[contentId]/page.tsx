"use client";

/**
 * Redirect: /test-prep/watch/[contentId] → /dashboard/test-prep/videos/watch/[contentId].
 * Companion to ../../page.tsx — video player URL preserved under the new path.
 */

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TestPrepWatchRedirect() {
  const params = useParams<{ contentId: string }>();
  const router = useRouter();
  const contentId = params?.contentId;

  useEffect(() => {
    if (contentId)
      router.replace(`/dashboard/test-prep/videos/watch/${contentId}`);
    else router.replace("/dashboard/test-prep/videos");
  }, [router, contentId]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <p className="text-slate-600 text-sm">
        Redirecting to /dashboard/test-prep/videos/watch/{contentId}…
      </p>
    </div>
  );
}
