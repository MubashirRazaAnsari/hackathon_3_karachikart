import { render, fireEvent, screen } from '@testing-library/react';
import AddToCartButton from '@/app/components/AddToCarButton';
import { CartProvider } from '@/app/context/CartContext';

describe('AddToCartButton', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'Test description',
    category: { name: 'Test' },
    stock: 10
  };

  it('adds product to cart when clicked', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add to Cart'));
    // Add assertions for cart state
  });
}); 