/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1',
  },
  // P0-2 (Session 26): the codebase now type-checks cleanly under
  // `npx tsc --noEmit`. Build failures on type errors are again surfaced,
  // so production builds catch regressions before they ship. Two large
  // legacy pages (fe-ee-course/page.tsx, xr-labs/scene-builder/page.tsx)
  // carry @ts-nocheck headers with TODO markers for follow-up refactors.
  // Three.js JSX + example-jsm modules are typed via src/types/three-*.d.ts
  // shims. If you need to bypass build errors during a refactor, prefer a
  // narrowly-scoped @ts-expect-error over flipping these flags back on.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config, { isServer }) => {
    // Handle Three.js and related packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
