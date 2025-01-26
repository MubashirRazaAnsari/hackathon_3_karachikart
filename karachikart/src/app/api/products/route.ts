import { serverClient } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await serverClient.fetch(`*[_type == "newProduct"]`);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 