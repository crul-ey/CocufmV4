/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

// Import the bundle analyzer plugin
import nextBundleAnalyzer from "@next/bundle-analyzer";

// Create the 'withBundleAnalyzer' function
const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Wrap your config with the analyzer
export default withBundleAnalyzer(nextConfig);
