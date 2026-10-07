import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // The signed-in app reads the session per request and hydrates user state on
    // the client, so only segments that opt in with `instant` are validated.
    instantInsights: { validationLevel: "manual-warning" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
