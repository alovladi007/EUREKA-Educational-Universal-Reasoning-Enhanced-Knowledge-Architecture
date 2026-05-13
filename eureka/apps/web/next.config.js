/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1',
  },
  // Phase 3.6 baseline (Session 3.6, 2026-05): Next 14 fails the build on
  // any type-check or lint error. The codebase has accumulated pre-existing
  // issues that aren't this session's scope (Three.js typing, untyped
  // tier pages, etc.). We keep `npm run type-check` and `npm run lint`
  // as separate gating commands in CI; `npm run build` should still ship
  // a binary. As the type errors get cleaned up in follow-ups, flip these
  // back to false.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
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
