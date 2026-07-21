"use client";

/**
 * EurekaMark — the EUREKA sparkle brandmark.
 *
 * A large 4-point sparkle with a small companion sparkle, in the brand's
 * violet→pink gradient. Colorful gradient reads well on both light and dark
 * surfaces, so a single mark works across the site (light nav, dark footer).
 * Pass `mono` to render a single-color version (uses currentColor) for
 * favicons or one-color contexts.
 *
 * The gradient id is per-instance (useId) so multiple marks on one page don't
 * collide.
 */

import { useId } from "react";

// One 4-point sparkle, centered in a 24×24 box (tips at N/E/S/W, concave sides).
const SPARKLE =
  "M12 1C12 7 7 12 1 12C7 12 12 17 12 23C12 17 17 12 23 12C17 12 12 7 12 1Z";

export function EurekaMark({
  className = "h-7 w-7",
  mono = false,
}: {
  className?: string;
  mono?: boolean;
}) {
  const rawId = useId();
  const gid = `eureka-grad-${rawId.replace(/[:]/g, "")}`;
  const fillMain = mono ? "currentColor" : `url(#${gid})`;
  const fillSmall = mono ? "currentColor" : "#8b5cf6";

  return (
    <svg
      viewBox="0 0 30 30"
      className={className}
      role="img"
      aria-label="EUREKA"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!mono && (
        <defs>
          <linearGradient id={gid} x1="4" y1="6" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a78bfa" />
            <stop offset="0.55" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#d16ba5" />
          </linearGradient>
        </defs>
      )}
      {/* main sparkle (lower-left) */}
      <path d={SPARKLE} transform="translate(0 6)" fill={fillMain} />
      {/* small companion sparkle (upper-right) */}
      <path d={SPARKLE} transform="translate(19 0) scale(0.42)" fill={fillSmall} />
    </svg>
  );
}
