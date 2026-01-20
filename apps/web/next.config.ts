import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  transpilePackages: ["@taskflow/shared", "@apollo/client"],
  output: "standalone",
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
