# @axiom/ui

Shared AXIOM React UI primitives. This is the canonical home for components that
more than one AXIOM surface would reuse.

## What is here

- **Math rendering** (`Math.tsx`): `InlineMath`, `BlockMath`, and `RichMath` (a
  string renderer that mixes prose with `$...$` inline and `$$...$$` block math),
  built on KaTeX with `htmlAndMathml` output so every expression carries MathML
  for screen readers.

Graphing (the Mafs coordinate plane) and the tutoring whiteboard canvas are the
next candidates to extract here.

## Honest note on consumption

`apps/web` currently **vendors** the same math primitives in
`apps/web/components/Math.tsx` rather than importing `@axiom/ui`. The reason is
purely build topology: the web container's Docker build context is `apps/web`
(see `apps/web/Dockerfile`), so it cannot resolve a sibling workspace package at
image-build time. Consolidating `apps/web` onto `@axiom/ui` is a mechanical
follow-up that moves the web image to a repo-root build context; the component
source here is the reference implementation for that move and for any second
consumer (a future admin app, an embed, or a service-rendered surface).

This package is workspace-managed and typechecks on its own
(`cd packages/ui && npx tsc --noEmit`).
