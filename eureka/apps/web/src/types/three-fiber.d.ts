/**
 * Type shim for @react-three/fiber JSX elements.
 *
 * Why this file exists:
 *   @react-three/fiber ships `dist/react-three-fiber.cjs.d.ts` as a one-line
 *   re-export ("export * from \"./declarations/src/index\"") which TypeScript
 *   refuses to resolve as a module under "moduleResolution": "bundler". As a
 *   result, JSX.IntrinsicElements never receives r3f's element catalog and
 *   every `<mesh>`, `<group>`, `<sphereGeometry>`, etc. shows up as
 *   "Property 'X' does not exist on type 'JSX.IntrinsicElements'".
 *
 * This shim short-circuits that resolution failure by importing the
 * resolvable subpath directly and augmenting the global JSX namespace so
 * every Three.js JSX element is typed correctly across the app.
 *
 * If you ever upgrade @react-three/fiber and it ships a flat `.d.ts` at
 * the package root, this file can be deleted.
 */

import type { ThreeElements } from '@react-three/fiber/dist/declarations/src/three-types';

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
