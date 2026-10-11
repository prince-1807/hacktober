/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['ioredis', 'cheerio', '@prisma/client']
  }
};

export default nextConfig;
