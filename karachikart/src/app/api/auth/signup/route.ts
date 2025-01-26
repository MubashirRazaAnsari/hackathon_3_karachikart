import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists in user collection
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const user = await client.create({
      _type: 'user',
      name,
      email,
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString(),
    });

    // Create customer document
    const customer = await client.create({
      _type: 'customer',
      name,
      contactInfo: {
        email,
        phone: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
      },
      orderHistory: [],
      wishlist: [],
      joinedDate: new Date().toISOString(),
    });

    // Update user with customer reference
    await client.patch(user._id).set({
      customerId: {
        _type: 'reference',
        _ref: customer._id,
      },
    }).commit();

    return NextResponse.json(
      { message: 'Account created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
} 