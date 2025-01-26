import { PLACEHOLDER_IMAGE_BASE64 } from '@/constants/images';
import { urlFor } from '@/sanity/lib/image';

export const getImageUrl = (image: any) => {
  try {
    if (!image) return PLACEHOLDER_IMAGE_BASE64;
    if (typeof image === 'string') return image;
    if (image._type === 'image' || image.asset) return urlFor(image).url();
    return PLACEHOLDER_IMAGE_BASE64;
  } catch (error) {
    console.error('Error processing image:', error);
    return PLACEHOLDER_IMAGE_BASE64;
  }
}; 