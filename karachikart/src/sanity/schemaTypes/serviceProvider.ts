const serviceProviderSchema = {
  name: 'serviceProvider',
  title: 'Service Provider',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
      ],
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    },
    {
      name: 'availability',
      title: 'Availability',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', type: 'string' },
            { name: 'startTime', type: 'string' },
            { name: 'endTime', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'ratings',
      title: 'Ratings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'rating', type: 'number' },
            { name: 'review', type: 'text' },
            { name: 'createdAt', type: 'datetime' },
          ],
        },
      ],
    },
    {
      name: 'joinedDate',
      title: 'Joined Date',
      type: 'datetime',
    },
  ],
};

export default serviceProviderSchema; 