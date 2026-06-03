import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_AVATAR_LINK as string]
  }
};

export default nextConfig;
