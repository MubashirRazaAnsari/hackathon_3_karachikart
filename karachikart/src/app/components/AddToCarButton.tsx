"use client";

import { urlFor } from '@/sanity/lib/image';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: { name: string } | string;
  image: string;
  productImage?: any;
  stock?: number;
  condition?: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.productImage ? urlFor(product.productImage).url() : product.image,
      category: typeof product.category === 'string' ? product.category : product.category.name,
      description: product.description,
      quantity: 1
    });

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