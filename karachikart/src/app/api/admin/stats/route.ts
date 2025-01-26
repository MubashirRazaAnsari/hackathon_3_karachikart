import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await client.fetch(`{
      "totalOrders": count(*[_type == "order"]),
      "totalProducts": count(*[_type == "newProduct"]),
      "totalCustomers": count(*[_type == "user" && role == "customer"]),
      "totalRevenue": sum(*[_type == "order" && status != "cancelled"].total),
      "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
        _id,
        orderNumber,
        total,
        status,
        "customer": user->{ name, email },
        _createdAt
      }
    }`);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
} 