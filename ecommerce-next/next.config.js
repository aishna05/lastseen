// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      });
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};


module.exports = nextConfig;