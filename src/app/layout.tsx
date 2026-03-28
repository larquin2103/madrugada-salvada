import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Diagnóstico 3AM - Madrugada Salvada",
  description: "Descubre la causa exacta de tus despertares a las 3AM y obtén una solución personalizada que funciona.",
  keywords: ["3AM", "insomnio", "dormir", "diagnóstico", "salud", "sueño", "madrugada"],
  authors: [{ name: "Madrugada Salvada" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Quiz Diagnóstico 3AM - Madrugada Salvada",
    description: "Descubre la causa exacta de tus despertares a las 3AM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Diagnóstico 3AM",
    description: "Descubre la causa exacta de tus despertares a las 3AM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
