import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Do not block production builds on ESLint errors; we'll address them separately.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
