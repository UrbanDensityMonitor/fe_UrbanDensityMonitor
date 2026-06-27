/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      // Exact match for streams list (preserves trailing slash)
      {
        source: "/api/streams",
        destination: `${apiUrl}/api/streams/`,
      },
      // Streams with sub-paths: /api/streams/uuid, /api/streams/uuid/...
      {
        source: "/api/streams/:path+",
        destination: `${apiUrl}/api/streams/:path+`,
      },
      // History
      {
        source: "/api/history",
        destination: `${apiUrl}/api/history/`,
      },
      {
        source: "/api/history/:path+",
        destination: `${apiUrl}/api/history/:path+`,
      },
      // Alerts
      {
        source: "/api/alerts",
        destination: `${apiUrl}/api/alerts/`,
      },
      {
        source: "/api/alerts/:path+",
        destination: `${apiUrl}/api/alerts/:path+`,
      },
      // Users
      {
        source: "/api/users",
        destination: `${apiUrl}/api/users/`,
      },
      {
        source: "/api/users/:path+",
        destination: `${apiUrl}/api/users/:path+`,
      },
      // Catch-all fallback
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
