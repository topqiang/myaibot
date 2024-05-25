/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false };
    }
    return config;
  }
  // ,babel: {
  //   presets: ['next/babel'],
  //   plugins: [
  //     ['import', { libraryName: 'antd', style: true }],
  //   ],
  // }
}

module.exports = nextConfig
