import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const API_ORIGIN =
  process.env.TASKFLOW_API_ORIGIN || "http://api.localhost:8000";

const nextConfig: NextConfig = {
  transpilePackages: ["@taskflow/shared", "@apollo/client"],
  output: "standalone",
  images: {
    // The app does not use `next/image`, so disable the optimization endpoint
    // instead of carrying the extra image-processing attack surface.
    unoptimized: true,
  },
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
  poweredByHeader: false,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
  },
  async rewrites() {
    return [
      {
        source: "/api",
        destination: `${API_ORIGIN}/api`,
      },
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/:path*`,
      },
      {
        source: "/graphql",
        destination: `${API_ORIGIN}/graphql`,
      },
      {
        source: "/graphql/:path*",
        destination: `${API_ORIGIN}/graphql/:path*`,
      },
    ];
  },
};

const bundleAnalyzerConfig = {
  reactStrictMode: false,
};

export default withBundleAnalyzer({
  ...nextConfig,
  ...bundleAnalyzerConfig,
});
