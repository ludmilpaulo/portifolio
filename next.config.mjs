/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      '127.0.0.1',             // for local Django media
      'localhost',             // in case you use localhost as your dev URL
      'ludmil.pythonanywhere.com' // your production server
    ],
  },
};

export default nextConfig;
