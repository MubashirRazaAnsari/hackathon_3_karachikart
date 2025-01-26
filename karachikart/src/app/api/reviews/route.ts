import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewData = await req.json();

    // Create the review in Sanity
    const review = await client.create({
      _type: 'review',
      rating: reviewData.rating,
      comment: reviewData.comment,
      product: reviewData.product,
      user: {
        _type: 'reference',
        _ref: session.user.id
      },
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
} 