import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@ui-vault/core"],
  outputFileTracingRoot: resolve(__dirname, "../../"),
  experimental: {
    optimizePackageImports: ["@ui-vault/core", "lucide-react"],
  },
};

export default nextConfig;
