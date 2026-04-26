// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This allows the HMR connection from your local network IP
    allowedDevOrigins: ['172.17.34.139'],
  },
}

module.exports = nextConfig