import { serverClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductReviews from '@/app/components/ProductReviews';
import AddToCartButton from '@/app/components/AddToCarButton';
import ProductDetailSkeleton from '@/app/components/ProductDetailSkeleton';
import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Product } from '@/types';

async function getProduct(id: string): Promise<Product> {
  try {
    const product = await serverClient.fetch(`
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

    if (!product) {
      notFound();
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const imageUrl = product.productImage ? urlFor(product.productImage).url() : '/placeholder.jpg';
  const stockMessage = product.stock === 0 ? 'Out of stock' : 'In stock';
  const stockCalculated = product.stock ? product.stock - 1 : 0;
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
              priority
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold">${product.price}</p>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-sm text-gray-500">
              Category: {typeof product.category === 'string' ? product.category : product.category.name}
            </p>
            {product.stock && (
              <p>Stock: {stockMessage}</p>
            )}
            <AddToCartButton product={product} />
          </div>
        </div>

        <div className="mt-16">
          <ProductReviews
            productId={product._id}
            reviews={product.reviews || []}
          />
        </div>
      </Suspense>
    </div>
  );
}
