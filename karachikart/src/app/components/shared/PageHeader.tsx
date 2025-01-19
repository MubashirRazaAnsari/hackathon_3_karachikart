'use client';

import Image from 'next/image';
import { IoChevronForwardOutline } from "react-icons/io5";

interface PageHeaderProps {
  title: string;
  currentPage: string;
  
}

export default function PageHeader({ title, currentPage  }: PageHeaderProps) {
  return (
    <header className="relative bg-black w-full">
      <div className="h-[300px] md:h-[400px] bg-cover bg-center relative">
        <Image
          src={'/pageheader.png'}
          alt={`${currentPage} Header`}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-sm md:text-base lg:text-lg mt-2 flex items-center gap-2">
            <span className="text-white">Home</span>
            <IoChevronForwardOutline />
            <span className="text-[#FF9F0D]">{currentPage}</span>
          </p>
        </div>
      </div>
    </header>
  );
} 