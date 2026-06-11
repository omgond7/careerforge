const remotePatterns = [
  { protocol: 'https', hostname: 'api.dicebear.com' },
  { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
];

const s3Url = process.env.S3_PUBLIC_URL;
if (s3Url) {
  remotePatterns.push({
    protocol: 'https',
    hostname: s3Url.replace('https://', '').split('/')[0] || 's3.amazonaws.com',
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false, // Enable strict checks for production
  },
  images: {
    remotePatterns,
  },
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    'bcryptjs',
    'pdf-parse',
    'mammoth',
    'ioredis',
    'nodemailer',
    'bullmq',
    'pg',
  ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
