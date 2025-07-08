/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/registos',
        destination: '/api/__registos',
      },
    ]
  },
}

module.exports = nextConfig