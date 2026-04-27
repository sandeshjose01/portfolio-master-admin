/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Keeps your existing Firebase build fixes
  transpilePackages: ['undici', 'firebase', '@firebase'],
  
  // 2. Authorize Cloudinary to show images and videos in your portfolio
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  webpack: (config) => {
    // This forces the build to ignore the specific problematic code in the client bundle
    config.externals.push({ undici: 'undici' });
    return config;
  },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
