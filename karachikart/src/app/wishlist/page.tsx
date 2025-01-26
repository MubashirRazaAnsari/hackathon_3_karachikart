'use client';

import { useSession } from 'next-auth/react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@/app/components/shared/Breadcrumb';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (product: any) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: urlFor(product.productImage).url(),
      category: typeof product.category === 'string' ? product.category : product.category.name,
      description: product.description,
      quantity: 1,
    });
    removeFromWishlist(product._id);
    toast.success('Added to cart');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-4">You need to be signed in to view your wishlist</p>
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 mb-4">
                <Image
                  src={urlFor(product.productImage).url()}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => moveToCart(product)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    removeFromWishlist(product._id);
                    toast.success('Removed from wishlist');
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link
            href="/new"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
} 