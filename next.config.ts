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
        source: "/insights",
        destination: "/",
        permanent: true,
      },
      {
        source: "/insights/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/energy-os",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/:slug",
        destination: "/solutions/:slug",
        permanent: true,
      },
      {
        source: "/for-business",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/projects/:slug",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
