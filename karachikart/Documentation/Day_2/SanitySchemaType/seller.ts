export default {
    name: 'seller',
    type: 'document',
    title: 'Seller',
    fields: [
      { name: 'sellerId', type: 'string', title: 'Seller ID', readOnly: true },
      { name: 'name', type: 'string', title: 'Name' },
      { name: 'contactInfo', type: 'object', fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
      ], title: 'Contact Info' },
      { name: 'products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }], title: 'Products' },
      { name: 'reviews', type: 'array', of: [{ type: 'reference', to: [{ type: 'review' }] }], title: 'Reviews' },
      { name: 'earnings', type: 'number', title: 'Earnings' },
      { name: 'joinedDate', type: 'datetime', title: 'Joined Date' },
    ],
  };