import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kit escolar Ecopipo | Mochila $490 con envío incluido',
  description:
    'Elige el diseño de tu mochila Ecopipo a $490 con envío incluido. Agrégala con la lonchera y llévate las dos por $780.',
  openGraph: {
    title: 'Kit escolar Ecopipo | Mochila $490 con envío incluido',
    description:
      'Elige tu diseño. Si quieres, agrega la lonchera y las dos llegan a casa por $780 con envío incluido.',
    images: 'https://ecopipo.com/matriz/wp-content/uploads/2024/06/mochila.png',
    locale: 'es_MX',
    type: 'website',
  },
}

export default function MochilaLayout({ children }: { children: React.ReactNode }) {
  return children
}
