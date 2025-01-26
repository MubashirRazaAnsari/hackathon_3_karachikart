'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 flex items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-white text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Elevate Your <br className="hidden lg:block" />Everyday Style
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0">
            Discover curated collections blending quality, comfort, and contemporary design
          </p>
          <Link href="/products">
            <button className="bg-white text-black px-8 py-3 md:px-10 md:py-4 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 font-medium shadow-lg">
              Explore Collections
            </button>
          </Link>
        </motion.div>
      </div>
      <Image
        src="/hero.jpg"
        alt="Modern fashion and lifestyle"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
    </section>
  );
} 