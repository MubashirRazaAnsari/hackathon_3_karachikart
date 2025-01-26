"use client";

import { urlFor } from '@/sanity/lib/image';
import { useCart, CartItem } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Product as SanityProduct } from '@/types';


interface Product extends SanityProduct {
  image?: string;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem: Product = {
      _id: product._id || '',
      name: product.name || '',
      price: product.price,
      productImage: product.productImage ? urlFor(product.productImage).url() : (product.image || '/placeholder.jpg'),
      category: product.category || { name: 'Uncategorized' },
      description: product.description || '',
      stock: product.stock || 0,
      quantity: 1
    };
    addToCart(cartItem);

    toast.success('Added to cart!', {
      position: 'bottom-right',
      autoClose: 2000
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-black text-white py-3 rounded-lg hover:bg-black/90 transition-all duration-300"
    >
      Add to Cart
    </button>
  );
}