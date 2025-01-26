import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const bids = await client.fetch(`
      *[_type == "secondhandProduct" && _id == $productId][0] {
        "bids": bids[] {
          amount,
          timestamp,
          "bidder": bidder->{
            _id,
            name
          }
        }
      }
    `, { productId: params.productId });

    return NextResponse.json({ bids: bids?.bids || [] });
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
} 