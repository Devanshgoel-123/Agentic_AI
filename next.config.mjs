/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: false,
  images: {
    domains: ["asset.eddy.finance",""],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty");
    config.externals.push("encoding");
    return config;
  },
  transpilePackages: ['@mui/material', '@mui/system'], 
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
      preventFullImport: true
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
      preventFullImport: true
    }
  }
};

export default nextConfig
