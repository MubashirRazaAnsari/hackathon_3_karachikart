"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import {
  FaHeart,
  FaSearch,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import SearchBar from '@/app/components/SearchBar';
import { useSession } from 'next-auth/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import UserDropdown from './UserDropdown';
import { useWishlist } from "@/app/context/WishlistContext";

interface DropdownProps {
  items: { label: string; href: string }[];
  isMenuOpen: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ items, isMenuOpen }) => {
  if (!isMenuOpen) return null;

  return (
    <div className="absolute top-full left-0 bg-white border rounded-md py-2 min-w-[150px] z-50">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="block px-4 py-2 text-black hover:text-gray-500 hover:bg-gray-900 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
      const { totalItems } = useCart();
      const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropdownHover = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const dropdownMenus = {
    Brand_New: [
      { label: 'All Products', href: '/new' },
      { label: 'Electronics', href: '/category/electronics' },
      { label: 'Clothing', href: '/category/clothing' },
      { label: 'Home & Living', href: '/category/home' },
      { label: 'Compare', href: '/compare' },
    ],
    Customer: [
      { label: 'My Profile', href: '/profile' },
      { label: 'My Orders', href: '/profile/orders' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Help Center', href: '/help' },
    ],
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'New Products', href: '/new' },
    { name: 'Compare', href: '/compare' },
    { name: 'Help', href: '/help' },
    { name: 'About', href: '/about' },
  ];

  return (
    <div className="w-full mx-auto sticky top-0 z-50 bg-white shadow-md mb-6">
      <div className="w-[85vw] h-[80px] mx-auto flex justify-between items-center my-4">
        <div className="flex items-center gap-2">
          <Link href={'/'}>
          <h1 className="text-2xl font-bold">Karachi<span className="text-gray-500">KART</span></h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-base font-medium">
          <Link href="/" className="hover:text-gray-500">
            Home
          </Link>
          <div
            className="relative"
            onMouseEnter={() => handleDropdownHover('products')}
            onMouseLeave={handleDropdownLeave}
          >
            <button className='hover:text-gray-500 flex items-center'>
              Products <FaChevronDown className='ml-1 text-xs' />
            </button>
            <Dropdown items={dropdownMenus.Brand_New} isMenuOpen={activeDropdown === 'products'} />
          </div>
          <div
            className="relative"
            onMouseEnter={() => handleDropdownHover('customer')}
            onMouseLeave={handleDropdownLeave}
          >
            <button className='hover:text-gray-500 flex items-center'>
              Account <FaChevronDown className='ml-1 text-xs' />
            </button>
            <Dropdown items={dropdownMenus.Customer} isMenuOpen={activeDropdown === 'customer'} />
          </div>
          <Link href="/help" className="hover:text-gray-500">
            Help
          </Link>
          <Link href="/about" className="hover:text-gray-500">
            About
          </Link>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center gap-4">
          <SearchBar />
          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative">
              <FaShoppingBag className="text-sm hover:text-gray-500 w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href={'/wishlist'} className="relative">
            {wishlist.length > 0 && (
               <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
              )}
            <FaHeart className="text-sm hover:text-gray-500 w-4 h-4" />
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
            {session?.user.role === 'admin' && (
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Admin Panel
              </Link>
            )}
            <button onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? (
                <FaTimes className="text-sm text-gray-500" />
              ) : (
                <FaBars className="text-sm text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed right-0 top-[4.5rem] bg-white rounded-lg shadow-lg w-64 z-50">
          <div className="flex flex-col items-start p-4">
            <div className="w-full border-b pb-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Products</h3>
              {dropdownMenus.Brand_New.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="w-full border-b pb-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Account</h3>
              {dropdownMenus.Customer.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="w-full">
              <Link
                href="/help"
                className="block py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <Link
                href="/about"
                className="block py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar2;
