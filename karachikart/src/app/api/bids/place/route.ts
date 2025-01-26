import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, amount } = await req.json();

    // Validate bid amount
    const product = await client.fetch(`
      *[_type == "secondhandProduct" && _id == $productId][0] {
        currentPrice,
        auctionEnd,
        status
      }
    `, { productId });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.status !== 'active') {
      return NextResponse.json({ error: 'Auction has ended' }, { status: 400 });
    }

    if (new Date(product.auctionEnd) < new Date()) {
      return NextResponse.json({ error: 'Auction has ended' }, { status: 400 });
    }

    if (amount <= product.currentPrice) {
      return NextResponse.json({ error: 'Bid must be higher than current price' }, { status: 400 });
    }

    // Place bid
    const bid = {
      _type: 'bid',
      bidder: {
        _type: 'reference',
        _ref: session.user.id,
      },
      amount,
      timestamp: new Date().toISOString(),
    };

    await client
      .patch(productId)
      .setIfMissing({ bids: [] })
      .append('bids', [bid])
      .set({ currentPrice: amount })
      .commit();

    return NextResponse.json({ message: 'Bid placed successfully', bid }, { status: 200 });
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json({ error: 'Failed to place bid' }, { status: 500 });
  }
} 