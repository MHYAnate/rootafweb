// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
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
//   reactCompiler: true,
// };

// export default nextConfig;

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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      
      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      
      // Local development
      { protocol: 'http', hostname: 'localhost' },
      
      // Add any other image hosts you might use
      { protocol: 'https', hostname: '*.githubusercontent.com' }, // GitHub avatars
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  reactCompiler: true,
};

export default nextConfig;