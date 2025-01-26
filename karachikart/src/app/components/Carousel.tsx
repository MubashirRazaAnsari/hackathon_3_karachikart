'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { urlFor } from '@/sanity/lib/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface CarouselItem {
  _id: string;
  title: string;
  image: any;
  link: string;
  description?: string;
}

export default function Carousel({ items }: { items: CarouselItem[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
    >
      {items.map((item) => (
        <SwiperSlide key={item._id}>
          <Link href={item.link}>
            <div className="relative w-full h-full group">
              <Image
                src={urlFor(item.image).url()}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm md:text-base">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
} 