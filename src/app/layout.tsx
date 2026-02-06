import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Analytics } from "@vercel/analytics/next"
import Header from "../components/Header";
import WhatsappButton from "./_components/WhatsappButton";
import FaqPackagesButton from "./_components/FaqPackagesButton";
import { PostHogContext } from "../context/PostHogContext";

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
  title: "Paquetes Ecopipo 6, 10, 15 y 20 piezas – Ahorra comprando al por mayor",
  description: "Compra paquetes especiales Ecopipo: 6, 10, 15 o 20 piezas. Más pañales reutilizables, mejor precio. Envíos a todo México. ¡Elige tu paquete y empieza a ahorrar hoy!",
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
    title: "Paquetes Ecopipo 6, 10, 15 y 20 piezas – Ahorra comprando al por mayor",
    description: "Compra paquetes especiales Ecopipo: 6, 10, 15 o 20 piezas. Más pañales reutilizables, mejor precio. Envíos a todo México. ¡Elige tu paquete y empieza a ahorrar hoy!",
    images: `/imgs/ch.jpg`,
    url: domain,
    siteName: "Ecopipo",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paquetes Ecopipo 6, 10, 15 y 20 piezas – Ahorra comprando al por mayor",
    description: "Compra paquetes especiales Ecopipo: 6, 10, 15 o 20 piezas. Más pañales reutilizables, mejor precio. Envíos a todo México. ¡Elige tu paquete y empieza a ahorrar hoy!",
    images: `/imgs/ch.jpg`,
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