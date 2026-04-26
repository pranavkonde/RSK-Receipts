import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Next.js/React use eval in development for richer stack traces; omit in production.
// https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
const scriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval'"
  : "'self' 'unsafe-inline'";

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://public-node.rsk.co https://api.coingecko.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
