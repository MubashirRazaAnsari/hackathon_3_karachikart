const bookingSchema = {
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'customer' }],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{ type: 'service' }],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'provider',
      title: 'Provider',
      type: 'reference',
      to: [{ type: 'serviceProvider' }],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'time',
      title: 'Time',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true
    }
  ]
};

export default bookingSchema; 