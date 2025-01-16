export default {
    name: 'serviceProvider',
    type: 'document',
    title: 'Service Provider',
    fields: [
      { name: 'serviceProviderId', type: 'string', title: 'Service Provider ID', readOnly: true },
      { name: 'name', type: 'string', title: 'Name' },
      { name: 'contactInfo', type: 'object', fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
      ], title: 'Contact Info' },
      { name: 'servicesOffered', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }], title: 'Services Offered' },
      { name: 'portfolio', type: 'array', of: [{ type: 'image' }], title: 'Portfolio' },
      { name: 'reviews', type: 'array', of: [{ type: 'reference', to: [{ type: 'review' }] }], title: 'Reviews' },
      { name: 'earnings', type: 'number', title: 'Earnings' },
      { name: 'joinedDate', type: 'datetime', title: 'Joined Date' },
    ],
  };