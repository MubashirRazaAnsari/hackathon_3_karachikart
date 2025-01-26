import { Category, Review } from "./types/index";

export interface Product {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  price: number;
  productImage?: any;
  image?: string;
  _type?: string;
  stock?: number;
  description?: string;
  category?: Category;
  quantity?: number;
  rating?: number;
  reviews?: Review[];
  isFeatured?: boolean;
  trending?: boolean;
}

export interface ExternalProduct {
  id: string;
  _id?: string;
  name: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
} 