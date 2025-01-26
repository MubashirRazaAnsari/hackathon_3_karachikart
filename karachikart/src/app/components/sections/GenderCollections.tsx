'use client';

import { motion } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
import { Product } from '@/types';

interface GenderCollectionsProps {
  mensProducts: Product[];
  womensProducts: Product[];
}

export default function GenderCollections({ mensProducts, womensProducts }: GenderCollectionsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CollectionSection 
            title="Men's Essentials"
            href={`/new/men's clothing`}
            products={mensProducts}
          />
          <CollectionSection 
            title="Women's Collection"
            href="/new/women's clothing"
            products={womensProducts}
          />
        </div>
      </div>
    </section>
  );
}

function CollectionSection({ title, href, products }: { 
  title: string; 
  href: string; 
  products: Product[] 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <Link href={href}>
        <div className="relative h-96">
          <Image
            src={products[0]?.image || '/images/product-placeholder.png'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
              <p className="text-lg">{products.length} curated items</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 