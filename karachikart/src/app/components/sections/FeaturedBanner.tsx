'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function FeaturedBanner() {
  return (
    <section className="relative h-[60vh] bg-gray-100">
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center text-white px-4"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Seasonal Essentials
          </h2>
          <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">
            Handpicked selections for the current season
          </p>
          <Link href="/collections/featured">
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all border border-white/30">
              Discover More
            </button>
          </Link>
        </motion.div>
      </div>
      <Image
        src="/hero2.jpg"
        alt="Featured seasonal collection showcase"
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={true}
      />
    </section>
  );
} 