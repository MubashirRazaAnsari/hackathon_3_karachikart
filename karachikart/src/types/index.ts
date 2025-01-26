// types.ts
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface Category {
  name: string;
}

export interface Product {
  _id: string;
  id?: string;
  _type?: 'newProduct' | 'secondhandProduct';
  title?: string;
  name: string;
  price: number;
  description: string;
  category: Category;  // Strictly typed as Category object
  productImage: any;
  image?: string;    // For external API images
  stock: number;
  rating?: number;
  isFeatured?: boolean;
  reviews?: Review[];
  trending?: boolean;
  quantity?: number;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  productImage: any;
  category: Category;  // Using the same Category type
  description: string;
  quantity: number;
  stock: number;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  _createdAt: string;
  user?: {
    name: string;
    _ref: string;
  };
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  deliveryTimeEstimate: string;
  availability: boolean;
  tags: string[];
  image: any;  // Added image property
  provider?: {
    _id: string;
    name: string;
    contactInfo: string;
    rating: Array<{ rating: number }>;
  };
}

export interface ExternalProduct extends Omit<Product, 'category'> {
  category: string;
  image: string;
} 