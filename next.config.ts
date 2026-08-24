import type { NextConfig } from "next";

/**
 * SECURITY HEADERS
 *
 * This is a public, read-only site: no accounts, no forms posting anywhere,
 * no third-party scripts, and fonts are self-hosted by next/font. That means
 * the policy can be genuinely tight rather than nominally present.
 *
 * On `script-src`: Next injects a small inline bootstrap script, so a nonce
 * would be required to drop `'unsafe-inline'` entirely — and a per-request
 * nonce forces every page to render dynamically, giving up static CDN
 * delivery on a site whose whole job is to load fast on a phone. Given there
 * is no user input anywhere in the app and no `dangerouslySetInnerHTML`, the
 * XSS surface this would defend is effectively nil, so the trade is not
 * worth it here. If a form, comment field or third-party embed is ever added,
 * move to a nonce in middleware at the same time.
 *
 * React's development build uses eval() for stack reconstruction, so the dev
 * server needs 'unsafe-eval' and a websocket for hot reload. Production has
 * neither.
 */
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Google Forms and WhatsApp share links are the only outbound destinations.
  `connect-src 'self'${isDev ? " ws: http://localhost:*" : ""}`,
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not advertise the framework version.
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    // Above the 75 default: these are the committee's own photographs of the
    // festival, and most people will see them on a high-density phone.
    qualities: [85],
    // Nothing is loaded from a remote host, so no remote patterns are allowed.
    remotePatterns: [],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
