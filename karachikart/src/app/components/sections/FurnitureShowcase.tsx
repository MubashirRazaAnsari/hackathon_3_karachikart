'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function FurnitureShowcase() {
  return (
    <section className="py-20 bg-indigo-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Modern Living Spaces
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Transform your home with our contemporary furniture collection
            </p>
            <Link href="/new?category=Chairs">
              <button className="bg-gray-900 text-white px-8 py-3 my-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                Explore Furniture
              </button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/heroFuniture.png"
              alt="Modern furniture"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 