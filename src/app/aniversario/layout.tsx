import type { Metadata } from 'next'

const description =
  'Arma tu pack de aniversario: Esencial, Inteligente, Libertad y Mystery Box. En Lubella, toallas, Pack 17 y calzones.'

export const metadata: Metadata = {
  title: 'Aniversario 17 | Ecopipo y Lubella',
  description,
  openGraph: {
    title: 'Aniversario 17 | Ecopipo y Lubella',
    description,
    images: [
      {
        url: '/aniversario/og.jpg',
        width: 1200,
        height: 630,
        alt: '17 Aniversario Ecopipo y Lubella',
      },
    ],
    url: '/aniversario',
    siteName: 'Ecopipo',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aniversario 17 | Ecopipo y Lubella',
    description,
    images: ['/aniversario/og.jpg'],
  },
}

export default function AniversarioLayout({ children }: { children: React.ReactNode }) {
  return children
}
