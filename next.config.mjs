/** @type {import('next').NextConfig} */
const nextConfig = { typescript: {
    ignoreBuildErrors: true,  // Ignores TypeScript errors only
  },
  output: 'export',  // This is important for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: false,  // Still checks for ESLint errors
  },};

export default nextConfig;