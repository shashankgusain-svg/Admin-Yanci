/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  async rewrites() {
    // Local migration E2E: browser → Next → scripts/migration-e2e-server.js
    if (process.env.MIGRATION_E2E_PROXY === "1") {
      return [
        {
          source: "/e2e-api/:path*",
          destination: "http://127.0.0.1:8089/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
