import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductReviews from '@/app/components/ProductReviews';
import BiddingSection from '@/app/components/BiddingSection';
import AddToCartButton from '@/app/components/AddToCarButton';
import ProductDetailSkeleton from '@/app/components/ProductDetailSkeleton';
import { Suspense } from 'react';
import Image from 'next/image';

async function getProduct(id: string) {
  return client.fetch(`
    *[_type == "secondhandProduct" && _id == $id][0] {
      _id,
      name,
      price,
      description,
      category,
      condition,
      image,
      seller->{
        _id,
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
}

export default async function SecondhandProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={urlFor(product.image).url()}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600">Condition: {product.condition}</p>
            <p className="text-gray-600">Seller: {product.seller.name}</p>
          </div>
          
          <p className="text-gray-600">{product.description}</p>
          
          <div className="space-y-4">
            <BiddingSection
              productId={product._id}
              currentPrice={product.price}
              highestBid={product.highestBid}
              bids={product.bids}
              endTime={product.endTime}
            />
            
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Suspense fallback={<div>Loading reviews...</div>}>
          <ProductReviews
            productId={product._id}
            reviews={product.reviews}
          />
        </Suspense>
      </div>
    </div>
  );
}
