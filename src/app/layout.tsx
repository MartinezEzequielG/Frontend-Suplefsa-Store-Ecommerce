import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderShell } from "@/components/HeaderShell";
import { Footer } from "@/components/Footer";
import { WhatsappFloatButton } from "@/components/WhatsappFloatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Suplementacion Formosa Store",
    template: "%s | Suplementacion Formosa",
  },
  description:
    "Tienda online de Suplementacion Formosa. Suplementación deportiva de calidad, envíos en Formosa y asesoramiento personalizado.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Suplementacion Formosa Store",
    description:
      "Suplementación deportiva de calidad, envíos en Formosa y asesoramiento personalizado.",
    siteName: "Suplementacion Formosa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suplementacion Formosa Store",
    description:
      "Suplementación deportiva de calidad, envíos en Formosa y asesoramiento personalizado.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <HeaderShell />
        <main>{children}</main>
        <Footer />
        <WhatsappFloatButton />
      </body>
    </html>
  );
}
