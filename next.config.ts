import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-84b3f9f603df43d5a151b142979ab42c.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
