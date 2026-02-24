import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  reactCompiler: true,
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'res.cloudinary.com' },
//       { protocol: 'https', hostname: '*.cloudinary.com' },
//       { protocol: 'http', hostname: 'localhost' },
//     ],
//   },
//   experimental: {
//     optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
//   },
// };

// module.exports = nextConfig;