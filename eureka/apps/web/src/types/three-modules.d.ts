/**
 * Ambient module declarations for three/examples/jsm subpaths.
 *
 * three.js v0.169 ships these as plain .js files with no .d.ts siblings,
 * so TypeScript can't resolve them as modules. We declare them here so the
 * imports compile; the actual runtime values come from the .js files at
 * eureka/node_modules/three/examples/jsm/.
 *
 * This file MUST be a global script (no top-level import/export) so the
 * `declare module` blocks are picked up as ambient declarations.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  export const GLTFLoader: any;
  export type GLTF = any;
}
declare module 'three/examples/jsm/loaders/DRACOLoader' {
  export const DRACOLoader: any;
}
declare module 'three/examples/jsm/loaders/KTX2Loader' {
  export const KTX2Loader: any;
}
declare module 'three/examples/jsm/controls/OrbitControls' {
  export const OrbitControls: any;
}
declare module 'three/examples/jsm/controls/TransformControls' {
  export const TransformControls: any;
}
declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  export const EffectComposer: any;
}
declare module 'three/examples/jsm/postprocessing/RenderPass' {
  export const RenderPass: any;
}
declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  export const UnrealBloomPass: any;
}
