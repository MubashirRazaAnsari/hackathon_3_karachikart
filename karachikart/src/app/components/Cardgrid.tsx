'use client';
import React from 'react'
import Card from './Card'

interface Product {
    id: string;
    name: string;
    category: string | { name: string; slug?: string };
    image: string;
    price: number;
}

interface CardgridProps {
    products: Product[];
    gridtitle?: string;
    lggrid?: boolean;
    buttontext?: string;
}

export default function Cardgrid({ products, gridtitle, lggrid, buttontext }: CardgridProps) {
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
            <div className={`grid grid-cols-2 md:grid-cols-3 ${lggrid ? 'lg:grid-cols-4' : ''} gap-6`}>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        id={product.id}
                        title={product.name}
                        category={product.category}
                        image={product.image}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    )
}

