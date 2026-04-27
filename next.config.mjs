/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile these packages to handle modern JS syntax
  transpilePackages: ['undici', 'firebase', '@firebase'],
  
  webpack: (config) => {
    // This forces the build to ignore the specific problematic code in the client bundle
    config.externals.push({ undici: 'undici' });
    return config;
  },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
