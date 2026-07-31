/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ketcher ships untranspiled ES syntax that Next 14 will not parse from
  // node_modules by default. Both halves of the pair have to be listed.
  transpilePackages: ['ketcher-react', 'ketcher-core'],
  env: {
    NEXT_PUBLIC_OCTET_API_URL:
      process.env.NEXT_PUBLIC_OCTET_API_URL || 'http://localhost:8500',
    NEXT_PUBLIC_EUREKA_LOGIN_URL:
      process.env.NEXT_PUBLIC_EUREKA_LOGIN_URL ||
      'http://localhost:4040/auth/login',
    NEXT_PUBLIC_EUREKA_URL:
      process.env.NEXT_PUBLIC_EUREKA_URL || 'http://localhost:4040',
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

module.exports = nextConfig;
