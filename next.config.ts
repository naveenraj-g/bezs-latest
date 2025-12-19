import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNectIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

const withNextIntl = createNectIntlPlugin();

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "naveen-raj-oy",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: {
    disable: true,
  },
});
