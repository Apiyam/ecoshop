import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banderazo Patrio Lubella 2026 | 15% en selección',
  description:
    'Promo Lubella para clientas: 15% comprando 5 o más toallas, pañoletas, protectores de lactancia y desmaquillantes.',
  openGraph: {
    title: 'Banderazo Patrio Lubella 2026',
    description:
      '15% desde 5 piezas de toallas, pañoletas, protectores de lactancia y desmaquillantes. El resto toma el lineamiento de volumen.',
    images: 'https://ecopipo.com/matriz/wp-content/uploads/2022/07/ecopipo_fav.png',
    locale: 'es_MX',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
