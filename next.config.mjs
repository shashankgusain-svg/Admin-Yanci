/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js + Jodit need eval/inline; Toast uses inline styles
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://api.investwithyanci.com https://*.s3.us-east-2.amazonaws.com https://s3.us-east-2.amazonaws.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.investwithyanci.com",
  "media-src 'self' blob: https://api.investwithyanci.com https://*.s3.us-east-2.amazonaws.com https://s3.us-east-2.amazonaws.com",
  // CSD PDF previews + Jodit helpers
  "frame-src 'self' blob: https://api.investwithyanci.com https://*.s3.us-east-2.amazonaws.com https://s3.us-east-2.amazonaws.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.investwithyanci.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yanci-fix-fast.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-east-2.amazonaws.com",
        pathname: "/yanci-fix-fast/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
