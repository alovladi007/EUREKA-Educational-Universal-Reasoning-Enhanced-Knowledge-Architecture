"use client";

/**
 * Redirect: /institutions/graduate-programs/[id] → /dashboard/graduate/admin/[id]
 * See ../page.tsx for the rationale.
 */

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function GraduateProgramDetailRedirect() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string | undefined;

  useEffect(() => {
    if (id) router.replace(`/dashboard/graduate/admin/${id}`);
    else router.replace("/dashboard/graduate/admin");
  }, [router, id]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <p className="text-slate-600 text-sm">Redirecting to /dashboard/graduate/admin/{id}…</p>
    </div>
  );
}
