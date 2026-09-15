import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [{ source: "/anna-dmitry", destination: "/sofia", permanent: true }];
  },
};

export default nextConfig;
