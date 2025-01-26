import { rest } from 'msw';

export const handlers = [
  rest.get('*/api/products', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          _id: '1',
          name: 'Test Product',
          price: 99.99,
          // ... other product fields
        },
      ])
    );
  }),
]; 