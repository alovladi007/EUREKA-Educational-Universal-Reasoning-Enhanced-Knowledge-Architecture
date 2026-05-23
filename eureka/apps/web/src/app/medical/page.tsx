"use client";

/**
 * Redirect: bare /medical → /dashboard/medical.
 * Mirrors /graduate, /undergraduate, /high-school defensive redirects.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MedicalRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/medical");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Medical Education lives in the dashboard</h1>
        <p className="text-slate-600 text-sm">
          Your med-ed work — QBank, Cases, Anatomy, OSCE, AI Tutor, tier
          enrolment, and resources — is all at{" "}
          <Link href="/dashboard/medical" className="text-primary underline">
            /dashboard/medical
          </Link>
          . Redirecting you now…
        </p>
      </div>
    </div>
  );
}
