/** @type {import('next').NextConfig} */
const nextConfig = { typescript: {
    ignoreBuildErrors: true,  // Ignores TypeScript errors only
  },
  eslint: {
    ignoreDuringBuilds: false,  // Still checks for ESLint errors
  },};

export default nextConfig;