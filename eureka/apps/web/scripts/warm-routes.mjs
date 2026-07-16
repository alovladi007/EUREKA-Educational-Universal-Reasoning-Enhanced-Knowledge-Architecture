/**
 * Dev-server route warmer (XR-9).
 *
 * Why: the web container runs `next dev`, which compiles routes on demand.
 * Every container restart/rebuild wipes that cache, so the first click on a
 * heavy route (the three.js XR portals pull 2k+ modules) paid a multi-second
 * compile — and when the shared Docker VM was under memory pressure, that
 * compile spike could OOM-kill the dev server entirely, restarting the loop.
 *
 * This script runs alongside the dev server at container start: it waits for
 * the server to come up, then requests the heavy routes one at a time
 * (sequential on purpose — parallel compiles multiply the memory spike this
 * exists to avoid). After it finishes, user clicks land on warm routes in
 * ~100ms. Exits quietly; never crashes the container.
 */

const BASE = process.env.WARM_BASE_URL || "http://127.0.0.1:3000";

const ROUTES = [
  "/",
  "/auth/login",
  "/dashboard",
  "/dashboard/xr-labs",
  "/dashboard/xr-labs/solar-system",
  "/dashboard/xr-labs/molecules",
  "/dashboard/xr-labs/anatomy",
  "/dashboard/xr-labs/scene-builder",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(maxMs = 180_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    try {
      const r = await fetch(BASE + "/", { redirect: "manual" });
      if (r.status > 0) return true;
    } catch {
      /* not up yet */
    }
    await sleep(1500);
  }
  return false;
}

async function main() {
  if (!(await waitForServer())) {
    console.log("[warm-routes] server never came up; giving up quietly");
    return;
  }
  console.log("[warm-routes] warming", ROUTES.length, "routes…");
  for (const route of ROUTES) {
    const t0 = Date.now();
    try {
      const r = await fetch(BASE + route, {
        redirect: "manual",
        signal: AbortSignal.timeout(300_000),
      });
      console.log(
        `[warm-routes] ${route} -> ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)}s`,
      );
    } catch (e) {
      console.log(`[warm-routes] ${route} failed (${e?.name}); continuing`);
    }
  }
  console.log("[warm-routes] done — heavy routes are hot");
}

main().catch((e) => console.log("[warm-routes] error:", e?.message));
