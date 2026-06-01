import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop browsers from MIME-sniffing a response away from the declared content-type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Only send the origin as the referrer when navigating to HTTPS
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Deny access to sensitive device APIs not used by this site
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85, 90],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
