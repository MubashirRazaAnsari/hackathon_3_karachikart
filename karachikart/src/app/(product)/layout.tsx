'use client';

import { Inter } from "next/font/google";
import "../globals.css";
import Navbar2 from "../components/shared/Navbar2";
import Footer from "../components/shared/Footer";
import { CartProvider } from "../context/CartContext";
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar2 />
          <main className="min-h-screen pt-16">
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
