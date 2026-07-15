/**
 * Instant loading state for XR Labs routes.
 *
 * Why this exists: the XR routes (solar-system, molecules, anatomy,
 * scene-builder, experience viewer) each pull in three.js. Without a loading
 * boundary, Next's client router waits for the whole route payload before it
 * commits the navigation — so clicking a portal card did NOTHING visible until
 * the chunk arrived. On a cold `next dev` cache that first compile can take
 * minutes (observed: 183s), and users reasonably concluded the cards were
 * broken. It also bites in production on a slow connection, where the 270 kB
 * three.js chunk still has to land.
 *
 * A loading.tsx wraps the segment in a Suspense boundary, so the navigation
 * commits immediately and this fallback renders while the route loads. The
 * click always does something.
 */

export default function XrLabsLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary"
        role="status"
        aria-label="Loading"
      />
      <div>
        <p className="font-medium">Loading the 3D workspace…</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Preparing the renderer. The first load of a 3D view takes a moment;
          after that it opens instantly.
        </p>
      </div>
    </div>
  );
}
