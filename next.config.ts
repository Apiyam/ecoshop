import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://www.ecopipo.com',
        permanent: false,
        missing: [{ type: 'host', value: 'www.ecopipo.com' }],
      },
      {
        source: '/:path*',
        destination: 'https://www.ecopipo.com',
        permanent: false,
        missing: [{ type: 'host', value: 'www.ecopipo.com' }],
      },
      // Temporal: reactivar para mandar el inicio a la landing de aniversario
      // { source: '/', destination: '/aniversario', permanent: false },
      // Sustituidas por la redirección global a https://www.ecopipo.com
      // {
      //   source: '/banderazo-patrio-ecopipo',
      //   destination: 'https://ecopipo.promo',
      //   permanent: true,
      // },
      // {
      //   source: '/banderazo-patrio-lubella',
      //   destination: 'https://lubella.com.mx',
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
