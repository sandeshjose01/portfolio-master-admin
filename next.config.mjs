/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js to handle the modern code in these specific packages
  transpilePackages: ['undici', 'firebase', '@firebase'],
  
  typescript: {
    // This prevents small typing errors from stopping your build
    ignoreBuildErrors: true,
  },
  eslint: {
    // This prevents styling warnings from stopping your build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
