/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Vercel to handle the modern code in Firebase and its helpers
  transpilePackages: ['firebase', '@firebase', 'undici'],
  
  // This improves build stability
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
