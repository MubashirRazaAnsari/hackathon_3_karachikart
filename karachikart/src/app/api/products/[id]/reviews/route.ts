import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';

const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    // Create the review using writeClient
    const review = await writeClient.create({
      _type: 'review',
      product: {
        _type: 'reference',
        _ref: params.id
      },
      user: {
        _type: 'reference',
        _ref: session.user.id
      },
      rating,
      comment,
      createdAt: new Date().toISOString()
    });

    // Update the product using writeClient
    await writeClient
      .patch(params.id)
      .setIfMissing({ reviews: [] })
      .append('reviews', [{
        _type: 'reference',
        _ref: review._id
      }])
      .commit();

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json(
      { error: 'Failed to post review' },
      { status: 500 }
    );
  }
} 