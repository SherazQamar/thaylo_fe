import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  transpilePackages: ["@heygen/liveavatar-web-sdk"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-84b3f9f603df43d5a151b142979ab42c.r2.dev",
        pathname: "/**",
      },
    ],
  },
  /**
   * Keep HTML/documents fresh after deploys (browsers revalidate the entry page).
   * Hashed /_next/static assets can be cached long-term — new builds get new hashes.
   * Exclude static so Cache-Control headers do not conflict.
   */
  async headers() {
    return [
      {
        source:
          "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
