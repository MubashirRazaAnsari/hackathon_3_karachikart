import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { client } from '@/sanity/lib/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingData = await req.json();

    // Validate required fields
    if (!bookingData.serviceId || !bookingData.providerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create customer document
    let customerId;
    const existingCustomer = await client.fetch(
      `*[_type == "customer" && email == $email][0]`,
      { email: session.user.email }
    );

    if (existingCustomer) {
      customerId = existingCustomer._id;
    } else {
      // Create new customer if doesn't exist
      const newCustomer = await client.create({
        _type: 'customer',
        name: session.user.name || 'Unknown',
        email: session.user.email,
      });
      customerId = newCustomer._id;
    }

    // Create booking in Sanity
    const booking = await client.create({
      _type: 'booking',
      user: {
        _type: 'reference',
        _ref: customerId
      },
      service: {
        _type: 'reference',
        _ref: bookingData.serviceId
      },
      provider: {
        _type: 'reference',
        _ref: bookingData.providerId
      },
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration,
      price: bookingData.price,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// Add OPTIONS method to handle CORS preflight requests
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 });
} 