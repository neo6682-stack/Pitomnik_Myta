import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['pitomnik-myta-backend.railway.app', 'localhost'],
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
  }
};

export default nextConfig;