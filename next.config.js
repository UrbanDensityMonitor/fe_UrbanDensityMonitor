/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Exact match for streams list (preserves trailing slash)
      {
        source: "/api/streams",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/streams/`,
      },
      // Streams with sub-paths: /api/streams/uuid, /api/streams/uuid/...
      {
        source: "/api/streams/:path+",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/streams/:path+`,
      },
      // History
      {
        source: "/api/history",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/history/`,
      },
      {
        source: "/api/history/:path+",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/history/:path+`,
      },
      // Alerts
      {
        source: "/api/alerts",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/`,
      },
      {
        source: "/api/alerts/:path+",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/:path+`,
      },
      // Users
      {
        source: "/api/users",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/users/`,
      },
      {
        source: "/api/users/:path+",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/users/:path+`,
      },
      // Catch-all fallback
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
