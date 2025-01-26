'use client';

import Link from "next/link";
import { useSession } from 'next-auth/react';
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import UserDropdown from './UserDropdown';

export default function ProductNavbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Karachi<span className="text-gray-500">KART</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link 
                href="/new" 
                className="text-gray-600 hover:text-gray-900"
              >
                New Products
              </Link>
              <Link 
                href="/secondhand" 
                className="text-gray-600 hover:text-gray-900"
              >
                Secondhand
              </Link>
              <Link 
                href="/compare" 
                className="text-gray-600 hover:text-gray-900"
              >
                Compare
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="relative">
              <FaHeart className="h-5 w-5 text-gray-600" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <FaShoppingBag className="h-5 w-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {session ? (
              <UserDropdown user={session.user} />
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 