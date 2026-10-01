import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/banderazo-patrio-ecopipo',
        destination: 'https://ecopipo.promo',
        permanent: true,
      },
      {
        source: '/banderazo-patrio-lubella',
        destination: 'https://lubella.com.mx',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
