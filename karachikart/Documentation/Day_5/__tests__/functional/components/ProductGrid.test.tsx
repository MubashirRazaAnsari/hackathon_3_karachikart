import { render, screen, fireEvent } from '@testing-library/react';
import ProductGrid from '@/app/components/ProductGrid';
import { WishlistProvider } from '@/app/context/WishlistContext';

const mockProducts = [
  {
    _id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'Test description',
    category: { name: 'Test Category' },
    productImage: 'test-image.jpg'
  }
];

describe('ProductGrid', () => {
  it('renders products correctly', () => {
    render(
      <WishlistProvider>
        <ProductGrid products={mockProducts} />
      </WishlistProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('handles wishlist interactions', () => {
    render(
      <WishlistProvider>
        <ProductGrid products={mockProducts} />
      </WishlistProvider>
    );

    const wishlistButton = screen.getByRole('button');
    fireEvent.click(wishlistButton);
    
    // Verify wishlist state changes
    expect(wishlistButton).toHaveClass('text-red-500');
  });
}); 