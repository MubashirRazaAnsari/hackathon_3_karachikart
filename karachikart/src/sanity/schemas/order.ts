export default {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'newProduct' }],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            },
            {
              name: 'price',
              title: 'Price at Time of Purchase',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'total',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'fullName', type: 'string', title: 'Full Name' },
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State' },
        { name: 'zipCode', type: 'string', title: 'ZIP Code' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
    },
    {
      name: 'paymentInfo',
      title: 'Payment Information',
      type: 'object',
      fields: [
        { name: 'method', type: 'string', title: 'Payment Method' },
        { name: 'transactionId', type: 'string', title: 'Transaction ID' },
        { name: 'status', type: 'string', title: 'Payment Status' },
      ],
    },
    {
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      status: 'status',
      total: 'total',
    },
    prepare(selection: any) {
      return {
        title: `Order #${selection.orderNumber}`,
        subtitle: `${selection.status} - $${selection.total}`,
      };
    },
  },
}; 