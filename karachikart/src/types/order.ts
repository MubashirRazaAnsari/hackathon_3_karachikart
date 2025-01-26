export interface OrderItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    productImage: any;
    price: number;
  };
  quantity: number;
  price: number;
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
  method: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _ref: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
} 