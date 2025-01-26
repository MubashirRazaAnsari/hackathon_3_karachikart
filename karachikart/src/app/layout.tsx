import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar2 from "./components/shared/Navbar2";
import Footer from "./components/shared/Footer";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from './components/ErrorBoundary';
import { NextAuthProvider } from "./providers/NextAuthProvider";
import { Toaster } from 'react-hot-toast';
import { WishlistProvider } from './context/WishlistContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KarachiKART - Your Ultimate Marketplace",
  description: "Shop new, secondhand products and services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we're in a product page using pathname
  const isProductPage = typeof window !== 'undefined' 
    ? window.location.pathname.startsWith('/new') || window.location.pathname.startsWith('/secondhand')
    : false;

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <NextAuthProvider>
            <WishlistProvider>
              <CartProvider>
                {!isProductPage && <Navbar2 />}
                <main className="flex-grow min-h-screen">
                  {children}
                </main>
                <Footer />
                <Toaster position="bottom-right" />
              </CartProvider>
            </WishlistProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
