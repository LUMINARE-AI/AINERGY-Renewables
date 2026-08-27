import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/services/:slug",
        destination: "/solutions/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
