/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force new deployment - timestamp: 2025-07-19
  generateBuildId: () => 'deploy-' + Date.now(),
}

export default nextConfig
