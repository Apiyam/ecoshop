import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Analytics } from "@vercel/analytics/next"
import Header from "../components/Header";
import WhatsappButton from "./_components/WhatsappButton";
import { PostHogContext } from "../context/PostHogContext";

const domain = process.env.NEXT_PUBLIC_DOMAIN as string;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecopipo – Paquetes Ecopipo",
  description: "Compra en nuestra tienda online y encuentra los mejores pañales Ecopipo en diferentes colores y estampados. ¡Dale a tu bebé lo mejor mientras cuidas el planeta! 🌍💚 🚛 Envíos a todo el país | 📦 Ofertas y descuentos exclusivos | 🛒 Compra fácil y segura",
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
    title: "Ecopipo – Paquetes Ecopipo",
    description: "Compra en nuestra tienda online y encuentra los mejores pañales Ecopipo en diferentes colores y estampados. ¡Dale a tu bebé lo mejor mientras cuidas el planeta! 🌍💚 🚛 Envíos a todo el país | 📦 Ofertas y descuentos exclusivos | 🛒 Compra fácil y segura",
    images: `/imgs/buenfin.jpg`,
    url: domain,
    siteName: "Ecopipo",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecopipo – Pipofin 2025",
    description: "Compra en nuestra tienda online y encuentra los mejores pañales Ecopipo en diferentes colores y estampados. ¡Dale a tu bebé lo mejor mientras cuidas el planeta! 🌍💚 🚛 Envíos a todo el país | 📦 Ofertas y descuentos exclusivos | 🛒 Compra fácil y segura",
    images: `/imgs/buenfin.jpg`,
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
          <WhatsappButton />
        </CartProvider>
        </PostHogContext>
      </body>
    </html>
  );
}