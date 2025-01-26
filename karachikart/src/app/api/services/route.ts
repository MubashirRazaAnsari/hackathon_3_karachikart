import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'service-provider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const service = await client.create({
      _type: 'service',
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      deliveryTimeEstimate: parseInt(data.deliveryTimeEstimate),
      availability: data.availability,
      tags: data.tags.split(',').map((tag: string) => tag.trim()),
      serviceProviderId: {
        _type: 'reference',
        _ref: session.user.id,
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'service-provider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const service = await client
      .patch(data._id)
      .set({
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        deliveryTimeEstimate: parseInt(data.deliveryTimeEstimate),
        availability: data.availability,
        tags: data.tags.split(',').map((tag: string) => tag.trim()),
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
} 