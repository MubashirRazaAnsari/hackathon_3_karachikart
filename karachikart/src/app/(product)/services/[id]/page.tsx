import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductReviews from '@/app/components/ProductReviews';
import BookingSection from '@/app/components/BookingSection';
import { Suspense } from 'react';

async function getService(id: string) {
  return client.fetch(`
    *[_type == "service" && _id == $id][0] {
      _id,
      name,
      price,
      description,
      duration,
      availability,
      image,
      provider->{
        _id,
        name,
        rating,
        description
      },
      "reviews": *[_type == "review" && service._ref == ^._id] {
        _id,
        rating,
        comment,
        "userName": user->name,
        _createdAt
      }
    }
  `, { id });
}

export default async function ServiceDetail({ params }: { params: { id: string } }) {
  const service = await getService(params.id);

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-video">
          <img
            src={urlFor(service.image).url()}
            alt={service.name}
            className="object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <p className="text-gray-600">Duration: {service.duration}</p>
            <p className="text-gray-600">Provider: {service.provider.name}</p>
          </div>
          
          <p className="text-gray-600">{service.description}</p>
          
          <BookingSection
            serviceId={service._id}
            price={service.price}
            availability={service.availability}
            duration={service.duration}
          />
        </div>
      </div>

      <div className="mt-16">
        <Suspense fallback={<div>Loading reviews...</div>}>
          <ProductReviews
            productId={service._id}
            reviews={service.reviews}
          />
        </Suspense>
      </div>
    </div>
  );
}
