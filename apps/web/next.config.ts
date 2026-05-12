import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
};

const bundleAnalyzerConfig = {
  reactStrictMode: false,
};

export default withBundleAnalyzer({
  ...nextConfig,
  ...bundleAnalyzerConfig,
});
