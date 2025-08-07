// next.config.js
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // More robust path resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/*': path.resolve(__dirname, 'src')
    }
    return config
  }
}

module.exports = nextConfig