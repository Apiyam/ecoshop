import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banderazo Patrio Ecopipo 2026 | 20% en pañales seleccionados',
  description:
    'Promo Patria para clientas: 20% en 3 o más pañales Muñequitas, Juguetitos, Apapacho, Monarca, Girasoles y Zarigüeya. Con 6, filtro de bambú de regalo. 3 filtros de $567 a $499.',
  openGraph: {
    title: 'Banderazo Patrio Ecopipo 2026',
    description:
      '20% en pañales patrios, filtro de regalo con 6 y pack de filtros a $499. Lineamiento de volumen en el resto, sin doblar descuentos.',
    images: 'https://ecopipo.com/matriz/wp-content/uploads/2022/07/ecopipo_fav.png',
    locale: 'es_MX',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
