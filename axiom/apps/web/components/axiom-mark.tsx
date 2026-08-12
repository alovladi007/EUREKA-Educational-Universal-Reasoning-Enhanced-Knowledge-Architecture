'use client';

/**
 * AxiomMark — AXIOM's own brandmark.
 *
 * The module used EurekaMark, the family sparkle. That is the right mark for
 * EUREKA and the wrong one here: it says nothing about the subject, and every
 * vertical wearing it makes them indistinguishable in a tab strip.
 *
 * This one is the therefore sign, ∴, drawn as a derivation: two premises on
 * top, edges down to a conclusion. It is the smallest true picture of what an
 * axiomatic system does, it is also literally the shape of AXIOM's skill graph
 * (nodes with prerequisite edges), and three dots and two lines survive being
 * shrunk to a 16px favicon, which a sparkle's thin points do not.
 *
 * The gradient keeps the EUREKA violet so the family relation is still legible
 * beside the other verticals. Per-instance gradient id via useId, because two
 * marks on one page with the same id makes the second one render with the
 * first one's fill.
 */

import { useId } from 'react';

export function AxiomMark({ className = 'h-7 w-7' }: { className?: string }) {
  const rawId = useId();
  const gid = `axiom-grad-${rawId.replace(/:/g, '')}`;
  return (
    <svg
      viewBox="0 0 30 30"
      className={className}
      role="img"
      aria-label="AXIOM"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={gid}
          x1="5"
          y1="4"
          x2="25"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a78bfa" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d16ba5" />
        </linearGradient>
      </defs>
      {/* The two derivation edges, premise -> conclusion. */}
      <path
        d="M8.5 9.5 L15 21.5 M21.5 9.5 L15 21.5"
        stroke={`url(#${gid})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
        fill="none"
      />
      {/* Premises. */}
      <circle cx="8.5" cy="9.5" r="3.1" fill={`url(#${gid})`} />
      <circle cx="21.5" cy="9.5" r="3.1" fill={`url(#${gid})`} />
      {/* Conclusion, drawn heavier: it is what the other two are for. */}
      <circle cx="15" cy="21.5" r="4" fill={`url(#${gid})`} />
    </svg>
  );
}
