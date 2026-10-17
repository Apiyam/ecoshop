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

const aniversarioOg = {
  url: "/aniversario/og.jpg",
  width: 1200,
  height: 630,
  alt: "17 Aniversario Ecopipo y Lubella",
};

export const metadata: Metadata = {
  title: "Aniversario 17 | Ecopipo y Lubella",
  description:
    "Arma tu pack de aniversario: Esencial, Inteligente, Libertad y Mystery Box. En Lubella, toallas, Pack 17 y calzones.",
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
    title: "Aniversario 17 | Ecopipo y Lubella",
    description:
      "Arma tu pack de aniversario: Esencial, Inteligente, Libertad y Mystery Box. En Lubella, toallas, Pack 17 y calzones.",
    images: [aniversarioOg],
    url: "/aniversario",
    siteName: "Ecopipo",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniversario 17 | Ecopipo y Lubella",
    description:
      "Arma tu pack de aniversario: Esencial, Inteligente, Libertad y Mystery Box. En Lubella, toallas, Pack 17 y calzones.",
    images: ["/aniversario/og.jpg"],
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