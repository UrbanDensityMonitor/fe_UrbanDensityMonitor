/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/streams',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/streams/`, 
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, 
      },
    ]
  },
};

module.exports = nextConfig;
