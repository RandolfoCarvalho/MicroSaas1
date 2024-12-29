"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from '../providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
          {children}
      </body>
    </html>
  );
}
