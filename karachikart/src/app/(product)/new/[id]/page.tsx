import { serverClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductReviews from '@/app/components/ProductReviews';
import AddToCartButton from '@/app/components/AddToCarButton';
import ProductDetailSkeleton from '@/app/components/ProductDetailSkeleton';
import { Suspense } from 'react';
import Image from 'next/image';

async function getProduct(id: string) {
  // Try to fetch from Sanity first
  try {
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
        "reviews": *[_type == "review" && product._ref == ^._id] {
          _id,
          rating,
          comment,
          "userName": user->name,
          _createdAt
        }
      }
    `, { id });

    if (sanityProduct) {
      return {
        ...sanityProduct,
        image: sanityProduct.productImage ? urlFor(sanityProduct.productImage).url() : null,
        isSanityProduct: true
      };
    }
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
  }

  // If not found in Sanity, try the external API
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const apiProduct = await response.json();
    
    return {
      _id: apiProduct.id.toString(),
      name: apiProduct.title,
      price: apiProduct.price,
      description: apiProduct.description,
      category: { name: apiProduct.category },
      image: apiProduct.image,
      stock: 10, // Default stock value
      reviews: [], // Empty reviews array for API products
      isSanityProduct: false
    };
  } catch (error) {
    console.error('Error fetching from API:', error);
    return null;
  }
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.image || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-sm text-gray-500">Category: {product.category.name}</p>
          <p>Stock : {product.stock}</p>
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="mt-16">
        <Suspense fallback={<div>Loading reviews...</div>}>
          <ProductReviews
            productId={product._id}
            reviews={product.reviews || []}
          />
        </Suspense>
      </div>
    </div>
  );
}
