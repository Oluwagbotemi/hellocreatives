import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Used by the blog to clean post HTML; must be loaded as-is, not bundled.
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
  // The share-image generator reads these files at runtime; make sure they're deployed with it.
  outputFileTracingIncludes: {
    "/api/events/[slug]/share-image": [
      "./src/assets/fonts/**/*",
      "./public/icons/events/**/*",
      "./public/images/events/**/*",
    ],
    "/api/blog/[slug]/preview-image": [
      "./src/assets/fonts/**/*",
      "./public/images/white-logo.svg",
      "./public/images/footer-image.svg",
    ],
  },
};

export default nextConfig;
