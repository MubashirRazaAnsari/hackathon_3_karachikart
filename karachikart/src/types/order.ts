export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  paymentIntentId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  trackingNumber?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      price: number;
      productImage: string;
    };
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
    method: string;
  };
  createdAt: string;
  updatedAt: string;
} 