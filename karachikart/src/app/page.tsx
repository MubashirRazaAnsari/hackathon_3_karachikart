'use client';

import { useEffect, useState } from "react";
import { client } from '@/sanity/lib/client';
import { Product } from '@/types/index';
import { Product as LocalProduct, ExternalProduct } from '@/types';
import Cardgrid from "./components/Cardgrid";
import ProductGrid from './components/ProductGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import HeroSection from './components/sections/HeroSection';
import FeaturedBanner from './components/sections/FeaturedBanner';
import GenderCollections from './components/sections/GenderCollections';
import ProductCarousel from './components/sections/ProductCarousel';
import FurnitureShowcase from './components/sections/FurnitureShowcase';
import SectionWrapper from './components/sections/SectionWrapper';

interface ProductState {
  trending: Product[];
  mens: Product[];
  womens: Product[];
  furniture: Product[];
  featured: Product[];
  new: Product[];
  secondHand: Product[];
}

const initialProductState: ProductState = {
  trending: [],
  mens: [],
  womens: [],
  furniture: [],
  featured: [],
  new: [],
  secondHand: []
};

export default function Home() {
  const [products, setProducts] = useState<ProductState>(initialProductState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          trendingData,
          mensData,
          womensData,
          newProducts,
          secondHandData,
          latest,
          furnitureData
        ] = await Promise.all([
          fetch('https://fakestoreapi.com/products?limit=6'),
          fetch("https://fakestoreapi.com/products/category/men's clothing"),
          fetch("https://fakestoreapi.com/products/category/women's clothing"),
          client.fetch(`*[_type == "newProduct"] | order(_createdAt desc)[0...6] {
            _id,
            name,
            price,
            description,
            category->{ name },
            productImage,
            rating,
            stock
          }`),
          client.fetch(`*[_type == "secondhandProduct"] | order(_createdAt desc)[0...6] {
            _id,
            name,
            price,
            description,
            category->{ name },
            productImage,
            rating,
            stock
          }`),
          fetch('https://fakestoreapi.com/products/category/electronics'),
          fetch('https://hackathon-apis.vercel.app/api/products?limit=10')
        ]);

        // Validate external API responses
        const responses = [trendingData, mensData, womensData, latest];
        const invalidResponse = responses.find(res => !res.ok);
        if (invalidResponse) throw new Error(`API Error: ${invalidResponse.statusText}`);

        const transformExternalData = async (response: Response): Promise<Product[]> => {
          const data = await response.json();
          return data.map((item: any): Product => ({
            id: item.id?.toString() || Math.random().toString(),
            _id: item.id?.toString() || Math.random().toString(),
            name: item.title || 'Untitled',
            price: parseFloat(item.price) || 0,
            productImage: item.image || '/images/product-placeholder.png',
            category: typeof item.category === 'object' ? item.category.name : (item.category || 'Uncategorized'),
            description: item.description || '',
            stock: 10,
            rating: item.rating?.rate || 0
          }));
        };

        setProducts({
          trending: await transformExternalData(trendingData),
          mens: await transformExternalData(mensData),
          womens: await transformExternalData(womensData),
          featured: newProducts,
          new: await latest.json(),
          secondHand: secondHandData,
          furniture: (await furnitureData.json()).map((item: any): Product => ({
            id: item._id || item.id || Math.random().toString(),
            _id: item._id || item.id || Math.random().toString(),
            name: item.name || 'Untitled',
            price: parseFloat(item.price) || 0,
            description: item.description || '',
            category: typeof item.category === 'object' ? item.category.name : (item.category || 'Furniture'),
            productImage: item.image || item.imageUrl || '/images/product-placeholder.png',
            stock: item.stock || 0,
            rating: item.rating?.rate || 0
          }))
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <SectionWrapper title="Trending Now" buttonText="View All" href="/trending">
        <Cardgrid products={products.trending} lggrid={true} />
      </SectionWrapper>

      <FeaturedBanner />

      <GenderCollections 
        mensProducts={products.mens} 
        womensProducts={products.womens} 
      />

      <SectionWrapper 
        title="Our Curated Picks" 
        description="Expertly selected favorites"
      >
        <ProductCarousel products={products.trending.length ? products.trending : products.featured} />
      </SectionWrapper>

      <SectionWrapper 
        title="Latest Drops" 
        buttonText="See New Arrivals" 
        href="/new"
      >
        <ProductGrid 
          products={products.secondHand} 
          showBidding={true} 
          productType="secondhand" 
        />
      </SectionWrapper>

      <FurnitureShowcase />

      <SectionWrapper 
        title="Home Essentials" 
        buttonText="Browse All" 
        href="/furniture"
      >
        <Cardgrid products={products.furniture as Product[]} lggrid={true} />
      </SectionWrapper>
    </main>
  );
}