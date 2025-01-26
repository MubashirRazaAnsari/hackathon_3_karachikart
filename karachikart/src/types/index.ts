export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: { name: string } | string;
  productImage?: any;
  image?: string; // for API products
  stock?: number;
  rating?: number;
  isFeatured?: boolean;
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  quantity: number;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
} 