'use client';
import React from 'react'
import Card from './Card'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Product } from '@/types/index';

interface CardgridProps {
    products: Product[];
    gridtitle?: string;
    lggrid?: boolean;
    buttontext?: string;
}

export default function Cardgrid({ products, gridtitle, lggrid, buttontext }: CardgridProps) {
    const processProduct = (product: any) => {
        const categoryName = typeof product.category === 'object' && product.category 
            ? product.category.name 
            : (typeof product.category === 'string' ? product.category : 'Uncategorized');

        return {
            id: product.id?.toString() ?? '',
            title: product.name ?? '',
            category: categoryName,
            image: product.productImage || product.image || '/images/product-placeholder.png',
            price: product.price ?? 0
        };
    };

    return (
        <div>
            {gridtitle && (
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">{gridtitle}</h2>
                    {buttontext && (
                        <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800">
                            {buttontext}
                        </button>
                    )}
                </div>
            )}
            
            <div className="relative">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={24}
                    slidesPerView={2}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: lggrid ? 4 : 3,
                        },
                    }}
                >
                    {products.map((product) => {
                        const processedProduct = processProduct(product);
                        return (
                            <SwiperSlide key={processedProduct.id}>
                                <Card {...processedProduct} />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Navigation arrows */}
                {/* <div className="swiper-button-prev !-left-4 lg:!-left-6 !text-black !h-full !top-0 !mt-0 !w-12 bg-gradient-to-r from-white via-white/70 to-transparent !scale-75 lg:!scale-100"></div>
                <div className="swiper-button-next !-right-4 lg:!-right-6 !text-black !h-full !top-0 !mt-0 !w-12 bg-gradient-to-l from-white via-white/70 to-transparent !scale-75 lg:!scale-100"></div> */}
            </div>
        </div>
    )
}