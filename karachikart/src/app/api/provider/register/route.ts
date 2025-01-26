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

    // Update user role to provider
    await client
      .patch(`*[_type == "user" && email == "${session.user.email}"][0]._id`)
      .set({ role: 'provider' })
      .commit();

    // Create provider profile
    const provider = await client.create({
      _type: 'serviceProvider',
      user: {
        _type: 'reference',
        _ref: session.user.id
      },
      name: session.user.name,
      email: session.user.email,
      status: 'pending', // You might want to review providers before approving
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, provider });
  } catch (error) {
    console.error('Error registering provider:', error);
    return NextResponse.json(
      { error: 'Failed to register as provider' },
      { status: 500 }
    );
  }
} 