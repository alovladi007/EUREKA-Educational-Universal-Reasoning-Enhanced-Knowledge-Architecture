"use client";

/**
 * Phase 15 workforce admin moved to /institutions/partnerships.
 * This stub redirects + offers a fallback link.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WorkforceMovedRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/institutions/partnerships"); }, [router]);
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Moved to the Institutions dashboard</h1>
        <p className="text-slate-600">
          Workforce admin now lives at{" "}
          <Link href="/institutions/partnerships" className="text-amber-700 underline">
            /institutions/partnerships
          </Link>.
        </p>
      </div>
    </div>
  );
}
