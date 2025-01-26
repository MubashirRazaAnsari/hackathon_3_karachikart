import { Metadata, Viewport } from 'next';

// Base viewport configuration for all pages
export const baseViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Helper function to generate metadata
export function generateMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | KarachiKart`,
    description,
    viewport: baseViewport,
  };
} 