"use client";

import React from "react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaMinus, FaPlus, FaTrashCan } from "react-icons/fa6";
import Summery from "@/app/components/Summery";
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleWishlist = (name: string) => {
    toast.success(`${name} added to wishlist!`);
  };

  const handleRemoveFromCart = (id: string, name: string) => {
    removeFromCart(id);
    toast.info(`${name} removed from cart`);
  };

  return (
    <main className="w-full min-h-screen bg-white py-6 md:py-6">
      <div className="w-full md:max-w-7xl lg:w-[85%] mx-auto px-4">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium">Oops! </h1>
            <p className="text-gray-600 mb-6">
              Seems like you haven't added anything to your cart yet
            </p>
            <Link
              href="/new"
              className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Cart Items */}
            <div className="w-full md:w-[60%] mt-6">
              <div className="flex flex-col p-4 bg-gray-100 rounded-lg">
                <h1 className="text-base md:text-xl font-medium">
                  Free Delivery
                </h1>
                <p className="text-sm text-gray-500">
                  Applies to orders over $140
                </p>
              </div>
              
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b border-gray-200 pb-4 mt-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="font-medium mt-2">${item.price}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => handleWishlist(item.name)}
                          className="text-gray-500 hover:text-black"
                        >
                          <FaHeart />
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.id, item.name)}
                          className="text-gray-500 hover:text-black"
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <FaMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="w-full md:w-[35%] mt-6">
              <Summery />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
