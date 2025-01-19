'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = '/placeholder.png',
  alt,
  fill,
  sizes = '100vw',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={fill ? sizes : undefined}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
} 