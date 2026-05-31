/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.qurancdn.com" },
      { protocol: "https", hostname: "cdn.islamic.network" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "api.alquran.cloud" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
