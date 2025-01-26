import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items, total, shippingAddress, paymentInfo } = await req.json();

    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();

    // Create order in Sanity
    const order = await client.create({
      _type: 'order',
      orderNumber,
      user: {
        _type: 'reference',
        _ref: session.user.id
      },
      items: items.map((item: any) => ({
        product: {
          _type: 'reference',
          _ref: item._id
        },
        quantity: item.quantity,
        price: item.price
      })),
      total,
      status: 'pending',
      shippingAddress,
      paymentInfo: {
        method: 'credit_card',
        ...paymentInfo
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      message: 'Order created successfully',
      orderId: order._id 
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        
        { error: 'Unauthorized' },
        { status: 401 }
      );
      console.log('It happened here');
    }

    const { searchParams } = new URL(req.url);
    const userId = session.user.id;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const orders = await client.fetch(
      `*[_type == "order" && user._ref == $userId] | order(createdAt desc) [$skip...$end] {
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
        userId,
        skip,
        end: skip + limit,
      }
    );

    const total = await client.fetch(
      `count(*[_type == "order" && user._ref == $userId])`,
      { userId }
    );

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 