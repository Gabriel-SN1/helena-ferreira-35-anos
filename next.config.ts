import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  cleanDistDir: !process.env.NEXT_DIST_DIR,
};

export default nextConfig;
