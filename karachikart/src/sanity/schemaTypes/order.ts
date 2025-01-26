const orderSchema = {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule: { required: () => any; }) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'product',
            type: 'reference',
            to: [{ type: 'newProduct' }, { type: 'secondhandProduct' }],
          },
          {
            name: 'quantity',
            type: 'number',
          },
          {
            name: 'price',
            type: 'number',
          }
        ]
      }],
    },
    {
      name: 'total',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'paymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
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
        { name: 'fullName', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'zipCode', type: 'string' },
        { name: 'country', type: 'string' },
      ],
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
    {
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'DHL tracking number for the order'
    },
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Unique order identifier',
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

export default orderSchema; 