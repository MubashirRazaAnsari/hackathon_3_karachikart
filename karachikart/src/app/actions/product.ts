'use server';

import { revalidatePath } from 'next/cache';
import { client } from '@/sanity/lib/client';
import { getServerSession } from 'next-auth';

export async function createProduct(data: any) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'seller') {
    throw new Error('Unauthorized');
  }

  try {
    const product = await client.create({
      _type: 'newProduct',
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      category: {
        _type: 'reference',
        _ref: data.category,
      },
      sellerId: {
        _type: 'reference',
        _ref: session.user.id,
      },
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/dashboard/products');
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProduct(productId: string, data: any) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'seller') {
    throw new Error('Unauthorized');
  }

  try {
    const product = await client
      .patch(productId)
      .set({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        category: {
          _type: 'reference',
          _ref: data.category,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();

    revalidatePath('/dashboard/products');
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

export async function deleteProduct(productId: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'seller') {
    throw new Error('Unauthorized');
  }

  try {
    await client.delete(productId);
    revalidatePath('/dashboard/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
} 