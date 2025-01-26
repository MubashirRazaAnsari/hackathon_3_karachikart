export default {
    name: 'review',
    type: 'document',
    title: 'Review',
    fields: [
      { name: 'reviewId', type: 'string', title: 'Review ID', readOnly: true },
      { name: 'productOrServiceId', type: 'reference', to: [{ type: 'product' }, { type: 'service' }], title: 'Product/Service' },
      { name: 'userId', type: 'reference', to: [{ type: 'customer' }, { type: 'seller' }], title: 'User' },
      { name: 'rating', type: 'number', title: 'Rating', validation: Rule => Rule.min(1).max(5) },
      { name: 'comment', type: 'text', title: 'Comment' },
      { name: 'timestamp', type: 'datetime', title: 'Timestamp' },
    ],
  };