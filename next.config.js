/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-pdf/renderer": "@react-pdf/renderer/lib/react-pdf.js",
    };
    return config;
  },
  transpilePackages: ["@react-pdf/renderer"],
};

module.exports = nextConfig;
