const reviewSchema = {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5)
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'customer' }],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [
        { type: 'newProduct' },
        { type: 'secondhandProduct' }
      ],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
};

export default reviewSchema;