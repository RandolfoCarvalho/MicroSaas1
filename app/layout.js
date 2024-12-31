"use client"; // Marcar o componente como cliente

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import Header from "./lib/ui/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Pega o caminho atual

  // Verifica se a rota é para '/card/[slug]'
  const isCardPage = pathname.startsWith('/card/');

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={isCardPage ? '' : 'pt-16'}>
        <Providers>
          {/* Renderiza o Header apenas se não for uma página de card */}
          {!isCardPage && <Header />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
