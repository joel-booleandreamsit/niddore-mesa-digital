/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Changed from 'standalone' to 'export' for static build
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add base path if deploying to subdirectory
  // basePath: '/niddore-mesa-digital',
}

export default nextConfig
