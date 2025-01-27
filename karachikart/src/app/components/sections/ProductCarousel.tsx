'use client';

import { Carousel } from 'react-responsive-carousel';
import { Product, ExternalProduct } from '@/types';
import Image from "next/image";
import Link from "next/link";
import { urlFor } from '@/sanity/lib/image';
import { PLACEHOLDER_IMAGE } from '@/constants/images';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface ProductCarouselProps {
  products: (Product | ExternalProduct)[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  if (!products?.length) return null;

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={4000}
        className="rounded-xl overflow-hidden"
        swipeable={true}
        emulateTouch={true}
      >
        {products.slice(0, 5).map((product) => (
          <CarouselItem 
            key={product.id || product.id || Math.random().toString()} 
            product={product} 
          />
        ))}
      </Carousel>
    </div>
  );
}

const isExternalProduct = (prod: Product | ExternalProduct): prod is ExternalProduct => {
  return 'title' in prod && 'id' in prod;
};

function CarouselItem({ product }: { product: Product | ExternalProduct }) {
  const getImageUrl = () => {
    try {
      if ('productImage' in product && product.productImage) {
        return product.productImage;
      }
      
      if ('image' in product && product.image) {
        return product.image;
      }

      return PLACEHOLDER_IMAGE;
    } catch (error) {
      console.error('Error processing image:', error);
      return PLACEHOLDER_IMAGE;
    }
  };

  const imageUrl = getImageUrl();
  const productName = isExternalProduct(product) ? product.title : product.name;
  const productId = isExternalProduct(product) ? product.id : product._id;
  const productType = isExternalProduct(product) ? 'products' : (product._type === 'secondhandProduct' ? 'secondhand' : 'new');

  return (
    <Link href={`/${productType}/${productId}`}>
      <div className="relative w-full aspect-[4/3] h-[400px] md:h-[600px]">
        <Image
          src={imageUrl}
          alt={`Product image of ${productName}`}
          fill
          className="object-contain bg-white"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                {productName}
              </h3>
              <p className="text-lg md:text-xl text-white/90">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 