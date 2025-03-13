/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@react-pdf/renderer"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      pdfkit: false,
    };
    return config;
  },
};

module.exports = nextConfig;
