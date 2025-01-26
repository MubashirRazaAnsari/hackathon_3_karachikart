import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { stock } = await request.json();
    const productId = params.id;

    // Update the stock in Sanity
    await client
      .patch(productId)
      .set({ stock: stock })
      .commit();

    return NextResponse.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
} 