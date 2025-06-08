/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dbwmmbqgjcsmfqtbusou.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
