/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["www.ludmilpaulo.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ludmilpaulo.com',
        port: '',
       // pathname: '/account123/**',
      },
    ],
  },
};

//const withImages = require("next-images");
//module.exports = withImages();

module.exports = nextConfig;