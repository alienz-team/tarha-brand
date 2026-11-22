import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  env: {
    // Resolved at build time (Workers have no filesystem): use /public/logo.png when present.
    NEXT_PUBLIC_HAS_LOGO: fs.existsSync(path.join(process.cwd(), "public", "logo.png")) ? "1" : "",
  },
};

export default nextConfig;

// Exposes Cloudflare bindings to `next dev` (no-op in production builds).
initOpenNextCloudflareForDev();
