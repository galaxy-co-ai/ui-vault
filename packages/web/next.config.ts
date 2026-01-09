import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ui-vault/core"],
  experimental: {
    optimizePackageImports: ["@ui-vault/core", "lucide-react"],
  },
};

export default nextConfig;
