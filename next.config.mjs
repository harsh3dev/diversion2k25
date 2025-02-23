const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,  // Ignores TypeScript errors only
    },
    images: {
      unoptimized: true, // Required for static export
    },
    eslint: {
      ignoreDuringBuilds: false,  // Still checks for ESLint errors
    },
    experimental: {
      runtime: 'edge',
    },
    output: 'standalone',
  };
  
  export default nextConfig;
  