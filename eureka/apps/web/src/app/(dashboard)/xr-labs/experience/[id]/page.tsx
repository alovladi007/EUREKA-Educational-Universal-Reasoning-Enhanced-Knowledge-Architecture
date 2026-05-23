"use client";

/**
 * Redirect: /xr-labs/experience/[id] → /dashboard/xr-labs/experience/[id].
 *
 * The WebXR viewer that used to live here has been migrated to
 * /dashboard/xr-labs/experience/[id] (it was the only sub-route missing
 * from the dashboard-canonical /dashboard/xr-labs/ tree).
 */

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function XRLabsExperienceRedirect() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    if (id) router.replace(`/dashboard/xr-labs/experience/${id}`);
    else router.replace("/dashboard/xr-labs");
  }, [router, id]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <p className="text-slate-600 text-sm">
        Redirecting to /dashboard/xr-labs/experience/{id}…
      </p>
    </div>
  );
}
