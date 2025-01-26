import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status, trackingNumber } = await req.json();

    const order = await client
      .patch(params.id)
      .set({
        status,
        trackingNumber,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId && user._ref == $userId][0]{
        _id,
        orderNumber,
        createdAt,
        status,
        items[]{
          _id,
          product->{
            _id,
            name,
            productImage,
            price
          },
          quantity,
          price
        },
        total,
        shippingAddress,
        trackingNumber
      }`,
      {
        orderId: params.id,
        userId: session.user.id,
      }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
} 