'use client';

import Image from "next/image";
import Link from "next/link";
import Cardgrid from "./components/Cardgrid";
import React, { useEffect, useState } from "react";
import ImageWithFallback from './components/ImageWithFallback';
import ProductListingSkeleton from "./components/ProductListingSkeleton";
import { client } from '@/sanity/lib/client';
import ProductGrid from './components/ProductGrid';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';

// Interface for external API products
interface ExternalProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function Home() {
  // Separate states for different product sections
  const [trendingProducts, setTrendingProducts] = useState<ExternalProduct[]>([]);
  const [mensProducts, setMensProducts] = useState<ExternalProduct[]>([]);
  const [womensProducts, setWomensProducts] = useState<ExternalProduct[]>([]);
  const [furnitureProducts, setFurnitureProducts] = useState<ExternalProduct[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for different sections
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch trending products
        const trendingRes = await fetch('https://fakestoreapi.com/products?limit=6');
        const trendingData = await trendingRes.json();
        setTrendingProducts(trendingData.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          name: item.title 
        })));

        // Fetch men's products
        const mensRes = await fetch("https://fakestoreapi.com/products/category/men's clothing");
        const mensData = await mensRes.json();
        setMensProducts(mensData.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          name: item.title
        })));

        // Fetch women's products
        const womensRes = await fetch("https://fakestoreapi.com/products/category/women's clothing");
        const womensData = await womensRes.json();
        setWomensProducts(womensData.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          name: item.title
        })));

        // Fetch featured products for carousel
        const featured = await client.fetch(`
          *[_type == "newProduct" && isFeatured == true][0...5] {
            _id,
            name,
            price,
            description,
            category->{
              name
            },
            productImage,
            rating
          }
        `);

        // Fetch latest products for grid
        const latest = await client.fetch(`
          *[_type == "newProduct"] | order(_createdAt desc)[0...6] {
            _id,
            name,
            price,
            description,
            category->{
              name
            },
            productImage,
            rating
          }
        `);

        setFeaturedProducts(featured);
        setNewProducts(latest);

        const furnitureRes = await fetch('https://hackathon-apis.vercel.app/api/products?limit=10')
        const furnitureData = await furnitureRes.json();
        const mappedFurnitureData = furnitureData.map((item: any) => ({
          id: item._id?.toString() || item.id?.toString() || Math.random().toString(),
          name: item.name || item.title || 'Untitled Product',
          price: parseFloat(item.price) || 0,
          description: item.description || '',
          category: item.category || 'Furniture',
          image: item.image || item.imageUrl || '/placeholder.jpg',
          rating: {
            rate: item.rating?.rate || 0,
            count: item.rating?.count || 0
          }
        }));
        setFurnitureProducts(mappedFurnitureData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-medium">Loading...</h1>
    </div>;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full my-5">
        <div className="w-full max-w-[1440px] mx-auto h-[50vh] md:h-[70vh] lg:h-[80vh] relative">
          <Image
            src="/hero.jpg"
            alt="Hero Banner"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">New Arrivals</h1>
              <Link href="/products">
                <button className="bg-white text-black px-8 py-3 rounded-full hover:bg-opacity-90 transition">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="w-full px-4 my-16">
        <div className="max-w-[1440px] mx-auto">
          <Cardgrid
            lggrid={true}
            gridtitle="Trending Now"
            buttontext="Shop"
            products={trendingProducts}
          />
        </div>
      </section>

      {/* Featured Banner */}
      <section className="w-full px-4 my-16">
        <div className="max-w-[1440px] mx-auto h-[40vh] md:h-[60vh] relative">
          <Image
            src="/hero2.webp"
            alt="Featured Collection"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Collection</h2>
              <p className="mb-6">Discover our handpicked selection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Men's & Women's Section */}
      <section className="w-full px-4 my-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Cardgrid
              lggrid={false}
              gridtitle="Men's Collection"
              buttontext="Men"
              products={mensProducts}
            />
          </div>
          <div>
            <Cardgrid
              lggrid={false}
              gridtitle="Women's Collection"
              buttontext="Women"
              products={womensProducts}
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full px-4 my-16">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            className="max-w-4xl mx-auto"
          >
            {featuredProducts.map((product) => (
              <Link 
                key={product._id} 
                href={product.productImage ? `/new/${product._id}` : `/products/${product._id}`}
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={product.productImage ? urlFor(product.productImage).url() : product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-lg">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Latest Products Grid */}
      <section className="w-full px-4 my-16">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-2xl font-bold mb-6">Latest Products</h2>
          <ProductGrid 
            products={newProducts}
            showBidding={false}
            productType="new"
          />
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="w-full px-4 my-16">
        <div className="max-w-[1440px] mx-auto h-[50vh] relative">
          <ImageWithFallback
            src="/images/hero/heroFurniture.png"
            alt="Special Offer"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Special Offer</h2>
              <p className="mb-6">Limited time deals on selected items</p>
              <Link href="/products">
                <button className="bg-white text-black px-8 py-3 rounded-full hover:bg-opacity-90 transition">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-purple-500">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center md:text-left">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white font-satoshi leading-tight">
                  The furniture brand for the future, with timeless designs
                </h1>
                <button className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary-dark transition-all duration-300">
                  View Collection
                </button>
              </div>
              <p className="text-white/80 font-satoshi text-lg md:text-xl max-w-xl mx-auto md:mx-0">
                A new era in eco-friendly furniture with Avelon, the French luxury
                retail brand with nice fonts, tasteful colors and a beautiful way
                to display things digitally using modern web technologies.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative w-full aspect-square hidden md:block md:aspect-auto md:h-[600px]">
              <Image 
                src="/heroFuniture.png" 
                alt="Modern furniture showcase" 
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full px-4 my-16">
        <div className="max-w-[1440px] mx-auto">
          <Cardgrid
            lggrid={true}
            gridtitle="Funiture"
            buttontext="Shop"
            products={furnitureProducts}
          />
        </div>
      </section>
    </main>
  );
}
