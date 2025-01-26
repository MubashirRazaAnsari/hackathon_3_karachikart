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
import { CompareProvider } from './context/CompareContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'KarachiKart',
  description: 'Your app description',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
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
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden`}>
        <ErrorBoundary>
          <NextAuthProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  {!isProductPage && <Navbar2 />}
                  <main className="flex-grow min-h-screen">
                    {children}
                  </main>
                  <Footer />
                  <Toaster position="bottom-right" />
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
