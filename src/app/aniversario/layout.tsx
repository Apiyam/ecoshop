import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aniversario 17 Ecopipo y Lubella',
  description:
    'Paquetes de aniversario con precio cerrado: Mystery Box, Esencial, Inteligente y Libertad. En Lubella, toallas, Pack 17 y calzones.',
  openGraph: {
    title: 'Aniversario 17 Ecopipo y Lubella',
    description:
      'Elige el paquete, mira qué incluye y el precio de una vez. Sin porcentajes en pantalla.',
    images: '/imgs/Ecopipo-llsm.png',
    locale: 'es_MX',
    type: 'website',
  },
}

export default function AniversarioLayout({ children }: { children: React.ReactNode }) {
  return children
}
