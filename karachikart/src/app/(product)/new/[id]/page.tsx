import { Suspense } from 'react';
import { serverClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductReviews from '@/app/components/ProductReviews';
import AddToCartButton from '@/app/components/AddToCarButton';
import ProductDetailSkeleton from '@/app/components/ProductDetailSkeleton';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Product } from '@/types';
import CompareButton from '@/app/components/CompareButton';
import { getImageUrl } from '@/utils/image';

async function getProduct(id: string): Promise<Product | null> {
  try {
    // First try to fetch from Sanity
    const sanityProduct = await serverClient.fetch(`
      *[_type == "newProduct" && _id == $id][0] {
        _id,
        name,
        price,
        description,
        category->{
          name
        },
        productImage,
        stock,
        rating,
        reviews[]->{
          _id,
          rating,
          comment,
          user->{
            name
          },
          createdAt
        }
      }
    `, { id });

    if (sanityProduct) {
      return {
        ...sanityProduct,
        image: sanityProduct.productImage ? urlFor(sanityProduct.productImage).url() : null
      };
    }

    // If not found in Sanity, try external APIs
    const [fakeStoreRes, furnitureRes] = await Promise.all([
      fetch(`https://fakestoreapi.com/products/${id}`),
      fetch(`https://hackathon-apis.vercel.app/api/products/${id}`),
      fetch(`https://hackathon-apis.vercel.app/api/products?limit=10`)
    ]);

    if (fakeStoreRes.ok) {
      const data = await fakeStoreRes.json();
      return {
        _id: data.id.toString(),
        name: data.title,
        price: data.price,
        description: data.description,
        category: { name: data.category },
        image: data.image,
        stock: 10, // Default stock
        rating: data.rating.rate,
        reviews: []
      };
    }

    if (furnitureRes.ok) {
      const data = await furnitureRes.json();
      return {
        _id: data._id || data.id,
        name: data.name || data.title,
        price: parseFloat(data.price),
        description: data.description,
        category: { name: data.category || 'Furniture' },
        image: data.image || data.imageUrl,
        stock: data.stock || 10,
        rating: data.rating?.rate || 0,
        reviews: []
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }

  const imageUrl = getImageUrl(product.productImage || product.image);
  const stockMessage = product.stock === 0 ? 'Out of stock' : 'In stock';

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden ">
            <Image
              src={imageUrl}
              alt={product.name || 'Product Image'}
              fill
              className="object-contain  shadow-lg rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="border-b pb-6">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-blue-600">
                  ${product.price.toFixed(2)}
                </p>
                {product.rating ? (
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{product.rating}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>5</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
              <p className="text-sm text-gray-500">
                Category: {product.category ? (typeof product.category === 'string' ? product.category : product.category.name) : 'N/A'}
              </p>
              <p className={`text-sm ${product.stock === 0 ? 'text-red-500' : 'text-green-500'}`}>
                {stockMessage}
              </p>
            </div>

            <div className="flex gap-4">
              <AddToCartButton product={product} />
              <CompareButton product={product} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            productId={product._id || ''}
            reviews={product.reviews || []}
          />
        </div>
      </Suspense>
    </div>
  );
}
