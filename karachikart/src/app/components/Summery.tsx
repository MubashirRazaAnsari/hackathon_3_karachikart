"use client"
import React from 'react'
import { useCart } from '../context/CartContext'
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Summery = () => {

    const { totalPrice } = useCart();
    const freeDelivery = totalPrice >= 140;
    const pathname = usePathname();
  
  return (
    <div className="w-full md:w-80 space-y-4">
    <h1 className="text-3xl md:text-4xl font-medium  font-satoshi mb-12">Summary</h1>
      <div className="flex justify-between text-base">
        <span>Subtotal</span>
        <span className="font-medium">£{totalPrice}</span>
      </div>
      <div className="flex justify-between text-base">
        <span>Delivery</span>
        <span className="font-medium">{freeDelivery ? "Free" : "£10"}</span>
      </div>
      <div className="flex justify-between text-base border-y border-gray-200 py-4">
        <span>Total</span>
        <span className="font-medium">£{totalPrice}</span>
      </div>
      <p className="text-gray-500 text-sm my-5">
        Taxes and shipping are calculated at checkout
      </p>
      {pathname !== "/checkout" && (
        <Link href={"/checkout"} className='w-full my-6'>

          <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors">
          Go to checkout
        </button>
        </Link>
      )}
    </div>
  )
}

export default Summery
