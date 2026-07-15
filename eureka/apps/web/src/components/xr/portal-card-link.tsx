"use client";

/**
 * A Link that gives INSTANT feedback when clicked.
 *
 * Why this exists: the XR portals (solar-system, molecules, anatomy) and the
 * scene builder each pull in three.js. With a plain <Link>, Next's App Router
 * has to fetch the new route's payload before it can render anything for it —
 * including a loading.tsx boundary. So on a slow load (a cold `next dev`
 * compile, or a slow connection in production) the click produced NO visible
 * response at all: the old page just sat there for seconds. Users reasonably
 * concluded the cards were broken.
 *
 * useTransition gives us the pending state on the CLIENT the instant the click
 * happens, independent of the route payload, so we can dim the card and show a
 * spinner immediately. This is the Next 14 equivalent of Next 15's
 * useLinkStatus.
 *
 * Note we keep a real <a href> underneath: middle-click / cmd-click / "open in
 * new tab" and crawlers all keep working, and the transition only takes over
 * plain left-clicks.
 */

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function PortalCardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <a
      href={href}
      className={`relative block ${className ?? ""}`}
      aria-busy={isPending}
      onClick={(e) => {
        // Let the browser handle new-tab / download / modified clicks.
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }
        e.preventDefault();
        startTransition(() => router.push(href));
      }}
    >
      {children}
      {isPending && (
        <span className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/80 backdrop-blur-[1px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Opening 3D view…
          </span>
        </span>
      )}
    </a>
  );
}
