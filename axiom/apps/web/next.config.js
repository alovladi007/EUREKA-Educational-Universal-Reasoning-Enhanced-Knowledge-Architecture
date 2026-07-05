/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_AXIOM_API_URL:
      process.env.NEXT_PUBLIC_AXIOM_API_URL || 'http://localhost:8400',
    NEXT_PUBLIC_EUREKA_LOGIN_URL:
      process.env.NEXT_PUBLIC_EUREKA_LOGIN_URL || 'http://localhost:4040/auth/login',
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

module.exports = nextConfig;
