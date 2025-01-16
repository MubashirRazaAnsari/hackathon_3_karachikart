export default {
    name: 'order',
    type: 'document',
    title: 'Order',
    fields: [
      { name: 'orderId', type: 'string', title: 'Order ID', readOnly: true },
      { name: 'customerId', type: 'reference', to: [{ type: 'customer' }], title: 'Customer' },
      { name: 'items', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }, { type: 'service' }] }], title: 'Items' },
      { name: 'totalAmount', type: 'number', title: 'Total Amount' },
      { 
        name: 'status', 
        type: 'string', 
        title: 'Status', 
        options: { list: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Canceled'] } 
      },
      { name: 'paymentMethod', type: 'string', title: 'Payment Method' },
      { name: 'deliveryMethod', type: 'string', title: 'Delivery Method' },
      { name: 'timestamp', type: 'datetime', title: 'Timestamp' },
    ],
  };