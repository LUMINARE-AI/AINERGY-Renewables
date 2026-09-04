import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [100, 75],
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
      {
        source: "/solutions/solar",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/solutions/energy-intelligence",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/solutions/ev",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/products/wattpe",
        destination: "https://watt-pe-two.vercel.app/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
