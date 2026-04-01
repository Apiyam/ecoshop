import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Analytics } from "@vercel/analytics/next"
import Header from "../components/Header";
import WhatsappButton from "./_components/WhatsappButton";
import { PostHogContext } from "../context/PostHogContext";
import FaqPackagesButton from "./_components/FaqPackagesButton";

const domain = "https://ecopipo.com/matriz";//process.env.NEXT_PUBLIC_DOMAIN as string;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arma tu paquete 6, 10, 15 o 20 piezas con descuentos | Ecopipo",
  description:
    "Crea tu paquete personalizado en Ecopipo: elige productos y suma 6, 10, 15 o 20 piezas para desbloquear descuentos progresivos. Más piezas, más ahorro en pañales y productos ecológicos.",
  icons: {
    icon: `${domain}/wp-content/uploads/2022/07/ecopipo_fav.png`,
    shortcut: `${domain}/wp-content/uploads/2022/07/ecopipo_fav.png`,
    apple: `${domain}/wp-content/uploads/2022/07/ecopipo_fav.png`,
    other: {
      rel: 'icon',
      url: `${domain}/wp-content/uploads/2022/07/ecopipo_fav.png`,
    },
  },
  openGraph: {
    title: "Paquetes personalizados de 6 a 20 piezas con descuentos | Ecopipo",
    description:
      "Arma tu paquete eligiendo lo que necesitas: 6, 10, 15 o 20 piezas con descuentos que aumentan según el tamaño del paquete. Productos ecológicos Ecopipo con ahorro real.",
    images: `/imgs/expo.jpg`,
    url: domain,
    siteName: "Ecopipo",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paquetes de 6, 10, 15 y 20 piezas con descuentos | Ecopipo",
    description:
      "Crea tu paquete personalizado: suma 6, 10, 15 o 20 piezas y obtén descuentos progresivos en la tienda Ecopipo.",
    images: `/imgs/expo.jpg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <PostHogContext>
        <Analytics />
        <CartProvider>
          <Header />
          {children}
          <FaqPackagesButton />
          <WhatsappButton />
        </CartProvider>
        </PostHogContext>
      </body>
    </html>
  );
}