import { serverClient } from '@/sanity/lib/client';

describe('Sanity API Integration', () => {
  it('fetches products successfully', async () => {
    const products = await serverClient.fetch(`*[_type == "newProduct"][0...5]`);
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('handles product details fetch', async () => {
    const product = await serverClient.fetch(`*[_type == "newProduct"][0]`);
    expect(product).toHaveProperty('_id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
  });
}); 