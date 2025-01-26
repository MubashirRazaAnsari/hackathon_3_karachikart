import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { client } from '@/sanity/lib/client';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // Validate the input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the user in Sanity
    const newUser = await client.create({
      _type: 'user',
      name,
      email,
      role,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
} 