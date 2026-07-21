"use client";

/**
 * EurekaMark — the EUREKA sparkle brandmark (AXIOM copy).
 *
 * Mirrors the mark used in the main EUREKA app so AXIOM carries the same
 * family branding. A 4-point sparkle + small companion in the violet→pink
 * gradient; reads on light and dark. Per-instance gradient id (useId).
 */

import { useId } from "react";

const SPARKLE =
  "M12 1C12 7 7 12 1 12C7 12 12 17 12 23C12 17 17 12 23 12C17 12 12 7 12 1Z";

export function EurekaMark({ className = "h-7 w-7" }: { className?: string }) {
  const rawId = useId();
  const gid = `eureka-grad-${rawId.replace(/[:]/g, "")}`;
  return (
    <svg viewBox="0 0 30 30" className={className} role="img" aria-label="EUREKA" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid} x1="4" y1="6" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d16ba5" />
        </linearGradient>
      </defs>
      <path d={SPARKLE} transform="translate(0 6)" fill={`url(#${gid})`} />
      <path d={SPARKLE} transform="translate(19 0) scale(0.42)" fill="#8b5cf6" />
    </svg>
  );
}
