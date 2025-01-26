import { Suspense } from 'react';
import { serverClient } from '@/sanity/lib/client';
import ProductReviews from '@/app/components/ProductReviews';
import BiddingSection from '@/app/components/BiddingSection';
import ProductDetailSkeleton from '@/app/components/ProductDetailSkeleton';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/utils/image';

async function getProduct(id: string) {
  try {
    const product = await serverClient.fetch(`
      *[_type == "secondhandProduct" && _id == $id][0] {
        _id,
        name,
        price,
        description,
        category->{
          name
        },
        productImage,
        condition,
        seller->{
          name,
          rating
        },
        endTime,
        highestBid,
        "bids": *[_type == "bid" && product._ref == ^._id] | order(amount desc) {
          _id,
          amount,
          "userName": user->name,
          _createdAt
        },
        "reviews": *[_type == "review" && product._ref == ^._id] {
          _id,
          rating,
          comment,
          "userName": user->name,
          _createdAt
        }
      }
    `, { id });

    if (!product) {
      return notFound();
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export default async function SecondhandProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const imageUrl = getImageUrl(product.productImage);

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
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
            <div className="border-b pb-6">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-blue-600">
                  ${product.price.toFixed(2)}
                </p>
                {product.seller?.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{product.seller.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Seller:</span>
                <span className="font-medium">{product.seller?.name || 'Unknown Seller'}</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <p className="text-sm text-gray-500">
                Category: {product.category?.name || 'Uncategorized'}
              </p>
              <p className="text-sm text-gray-500">Condition: {product.condition}</p>
            </div>

            <BiddingSection
              productId={product._id}
              currentPrice={product.price}
              highestBid={product.highestBid}
              bids={product.bids || []}
              endTime={product.endTime}
            />
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
