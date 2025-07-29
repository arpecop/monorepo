import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://can.renewz.org' : undefined,
};

export default nextConfig;
