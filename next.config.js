/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: config => {
    config.module.rules.push({
      test: /\.(glsl)/,
      use: ['raw-loader'],
    });
    return config;
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['github.com'],
    path: '/_next/image',
    loader: 'default',
    loaderFile: '',
    disableStaticImages: true,
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    contentDispositionType: 'inline',
    remotePatterns: [],
    unoptimized: false,
  },
};

const withImages = require('next-images');

module.exports = withImages(nextConfig);
