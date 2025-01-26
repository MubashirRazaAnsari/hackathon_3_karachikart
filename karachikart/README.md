# KarachiKART - E-commerce Platform

A modern e-commerce platform built with Next.js, Sanity CMS, and TypeScript.

## Features

### Authentication
- User registration and login
- Role-based authentication (Customer, Seller, Service Provider, Admin)
- Protected routes and API endpoints
- Session management with NextAuth.js

#### Authentication
- Google OAuth integration
- Role-based access (Admin/User)
- Protected routes
- User profile management

#### Shopping Experience
- Product browsing with categories
- Product search functionality
- Product details with images
- Product reviews and ratings
- Add to cart functionality
- Wishlist management
- Product comparison tool
- Responsive product grid layout

#### Shopping Cart
- Add/remove items
- Adjust quantities
- Persistent cart storage
- Real-time price updates
- Cart item count indicator

#### Product Features
- Detailed product views
- Product categories
- Product images with fallback
- Price display
- Stock status
- Product descriptions
- Related products

### Admin Features

#### Dashboard
- Overview statistics
- Total products count
- Total users count
- Total orders count
- Recent orders display
- Sales analytics

#### Product Management
- Add new products
- Edit existing products
- Delete products
- Manage product inventory
- Product image upload
- Category assignment

#### User Management
- View all users
- Manage user roles
- Delete users
- User activity tracking
- User profile management

#### Order Management
- View all orders
- Order status updates
- Order history
- Customer details

### Technical Features

#### Frontend
- Responsive design
- Mobile-first approach
- Dynamic routing
- Client-side state management
- Loading states and skeletons
- Error handling
- Toast notifications

#### Backend
- Sanity CMS integration
- API routes
- Data validation
- Image optimization
- Secure authentication
- Role-based permissions

#### Performance
- Image optimization
- Lazy loading
- Dynamic imports
- Optimized builds
- Caching strategies

## Tech Stack

- Next.js 14
- TypeScript
- Sanity CMS
- NextAuth.js
- Tailwind CSS
- React Context
- React Hot Toast
- React Icons
- React Responsive Carousel

## Environment Setup

Required environment variables:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-13
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
SANITY_API_TOKEN=your_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (admin)/         # Admin panel routes
│   ├── (product)/       # Product routes
│   ├── api/            # API routes
│   ├── components/     # Reusable components
│   └── context/        # Context providers
├── sanity/
│   ├── lib/           # Sanity configuration
│   └── schemas/       # Content schemas
└── types/            # TypeScript definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
