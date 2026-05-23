"use client";

/**
 * Redirect: /xr-labs/scene-builder → /dashboard/xr-labs/scene-builder.
 *
 * Companion to ../page.tsx's redirect. The original 1039-line scene
 * builder here was very similar to /dashboard/xr-labs/scene-builder
 * (1091 lines) — keep the sidebar-canonical one, redirect this URL.
 * Any divergent functionality between the two implementations is worth
 * a follow-up audit but is out of scope for the route-collision pass.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function XRLabsSceneBuilderRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/xr-labs/scene-builder");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">XR Scene Builder moved</h1>
        <p className="text-slate-600 text-sm">
          The XR scene builder now lives at{" "}
          <Link
            href="/dashboard/xr-labs/scene-builder"
            className="text-primary underline"
          >
            /dashboard/xr-labs/scene-builder
          </Link>
          . Redirecting you now…
        </p>
      </div>
    </div>
  );
}
