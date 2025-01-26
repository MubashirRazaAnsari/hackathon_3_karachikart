"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
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
  FaInfoCircle,
} from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import SearchBar from "@/app/components/SearchBar";
import { useSession } from "next-auth/react";
import UserDropdown from "./UserDropdown";
import { useWishlist } from "@/app/context/WishlistContext";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setMobileDropdown(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate role-based menu items
  const getRoleBasedMenus = () => {
    const baseMenus = {
      products: [
        { label: 'New Products', href: '/new', icon: FaBox },
        { label: 'Second Hand', href: '/secondhand', icon: FaBox },
        {label:'Services', href:'/services', icon:FaBox},
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

  const menuItems = getRoleBasedMenus();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            Karachi<span className="text-gray-600">KART</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="nav-link">
              Home
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link flex items-center">
                Products <FaChevronDown className="ml-1" />
              </button>
              <DropdownMenu
                items={menuItems.products}
                isOpen={activeDropdown === "products"}
              />
            </div>

            {/* Support Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("help")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link flex items-center">
                Support <FaChevronDown className="ml-1" />
              </button>
              <DropdownMenu
                items={menuItems.help}
                isOpen={activeDropdown === "help"}
              />
            </div>

            {/* Account Dropdown */}
            {session && (
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown("customer")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-link flex items-center">
                  Account <FaChevronDown className="ml-1" />
                </button>
                <DropdownMenu
                  items={menuItems.customer}
                  isOpen={activeDropdown === "customer"}
                />
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FaSearch className="h-5 w-5" />
            </button>

            {/* Desktop Search */}
            <div className="hidden lg:block w-64">
              <SearchBar />
            </div>

            {/* Cart */}
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

            {/* User Auth */}
            {session ? (
              <UserDropdown user={session.user} />
            ) : (
              <Link
                href="/auth/signin"
                className="nav-link hidden lg:block"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden icon-button"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="lg:hidden pb-4">
            <SearchBar />
          </div>
        )}
      </div>

     {/* Mobile Menu */}
     {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-700">Products</div>
              {menuItems.products.map((item, index) => (
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
              {menuItems.help.map((item, index) => (
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
                {menuItems.customer.map((item, index) => (
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
    </nav>
  );
};

// Dropdown Component
const DropdownMenu = ({ items, isOpen }: { items: MenuItem[]; isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px]">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex items-center px-4 py-2 text-base text-gray-700 gap-2 hover:bg-gray-50"
        >
          {item.icon && <item.icon  />}
          {item.label}
        </Link>
      ))}
    </div>
  );
};

// Style classes
const navLink = "text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium";
const iconButton = "text-gray-600 hover:text-gray-900 p-2 relative";
const badge = "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center";
const mobileNavLink = "block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-md";
const mobileNavSubLink = "block py-2 px-6 text-gray-500 hover:bg-gray-50 rounded-md text-sm";

export default Navbar;