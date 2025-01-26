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
  FaStore,
  FaBox,
  FaCog,
  FaShoppingCart,
  FaChartLine,
  FaHeadset,
  FaQuestionCircle,
  FaInfoCircle
} from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import SearchBar from '@/app/components/SearchBar';
import { useSession } from 'next-auth/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import UserDropdown from './UserDropdown';
import { useWishlist } from "@/app/context/WishlistContext";

interface DropdownProps {
  items: { label: string; href: string; icon?: React.ComponentType }[];
  isMenuOpen: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ items, isMenuOpen }) => {
  if (!isMenuOpen) return null;

  return (
    <div className="absolute top-full left-0 bg-white border rounded-md py-2 min-w-[200px] z-50 shadow-lg">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="block"
        >
          <div className="flex items-center px-4 py-2 gap-2 text-gray-700 hover:bg-gray-100 transition-colors">
            {item.icon && <item.icon />}
            {item.label}
          </div>
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

  const getRoleBasedMenus = () => {
    const baseMenus = {
      products: [
        { label: 'All Products', href: '/new', icon: FaBox },
        { label: 'Compare', href: '/compare', icon: FaChartLine },
      ],
      customer: [
        { label: 'My Profile', href: '/profile', icon: FaUser },
        { label: 'My Orders', href: '/profile/orders', icon: FaShoppingCart },
        { label: 'Wishlist', href: '/wishlist', icon: FaHeart },
      ],
      help: [
        { label: 'Help Center', href: '/help', icon: FaHeadset },
        { label: 'FAQ', href: '/faq', icon: FaQuestionCircle },
        { label: 'About Us', href: '/about', icon: FaInfoCircle },
      ]
    };

    if (session?.user?.role === 'admin') {
      baseMenus.customer.push(
        { label: 'Admin Dashboard', href: '/dashboard', icon: FaChartLine },
        { label: 'Manage Products', href: '/products', icon: FaBox },
        { label: 'Manage Orders', href: '/orders', icon: FaShoppingCart },
        { label: 'Settings', href: '/settings', icon: FaCog }
      );
    } else if (session?.user?.role === 'seller') {
      baseMenus.customer.push(
        { label: 'Seller Dashboard', href: '/seller', icon: FaStore },
        { label: 'My Products', href: '/seller/products', icon: FaBox },
        { label: 'Orders', href: '/seller/orders', icon: FaShoppingCart },
        { label: 'Analytics', href: '/seller/analytics', icon: FaChartLine }
      );
    } else if (session?.user?.role === 'service-provider') {
      baseMenus.customer.push(
        { label: 'Provider Dashboard', href: '/provider', icon: FaStore },
        { label: 'My Services', href: '/provider/services', icon: FaBox },
        { label: 'Bookings', href: '/provider/bookings', icon: FaShoppingCart },
        { label: 'Schedule', href: '/provider/schedule', icon: FaChartLine }
      );
    }

    return baseMenus;
  };

  const menus = getRoleBasedMenus();

  return (
    <div className="w-full mx-auto sticky top-0 z-50 bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={'/'}>
              <h1 className="text-xl sm:text-2xl font-bold">Karachi<span className="text-gray-500">KART</span></h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('products')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                Products <FaChevronDown className="ml-1 h-3 w-3" />
              </button>
              <Dropdown items={menus.products} isMenuOpen={activeDropdown === 'products'} />
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('help')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                Support <FaChevronDown className="ml-1 h-3 w-3" />
              </button>
              <Dropdown items={menus.help} isMenuOpen={activeDropdown === 'help'} />
            </div>

            {session && (
              <div
                className="relative"
                onMouseEnter={() => handleDropdownHover('account')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  Account <FaChevronDown className="ml-1 h-3 w-3 mx-1" />
                </button>
                <Dropdown items={menus.customer} isMenuOpen={activeDropdown === 'account'} />
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <SearchBar />
            
            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
              <FaShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link href="/wishlist" className="relative text-gray-700 hover:text-gray-900">
              <FaHeart className="h-6 w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {session ? (
              <UserDropdown user={session.user} />
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-700">Products</div>
              {menus.products.map((item, index) => (
                <Link key={index} href={item.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 pl-6">
                  <span className="flex items-center">
                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-700">Support</div>
              {menus.help.map((item, index) => (
                <Link key={index} href={item.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 pl-6">
                  <span className="flex items-center">
                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {session && (
              <div className="space-y-1">
                <div className="px-3 py-2 text-base font-medium text-gray-700">Account</div>
                {menus.customer.map((item, index) => (
                  <Link key={index} href={item.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 pl-6">
                    <span className="flex items-center">
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar2;
