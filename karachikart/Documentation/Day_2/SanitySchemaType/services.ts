export default {
    name: 'service',
    type: 'document',
    title: 'Service',
    fields: [
      { name: 'serviceId', type: 'string', title: 'Service ID', readOnly: true },
      { name: 'title', type: 'string', title: 'Title' },
      { name: 'description', type: 'text', title: 'Description' },
      { name: 'price', type: 'number', title: 'Price' },
      { name: 'serviceProviderId', type: 'reference', to: [{ type: 'serviceProvider' }], title: 'Service Provider' },
      { name: 'availability', type: 'boolean', title: 'Availability' },
      { name: 'tags', type: 'array', of: [{ type: 'string' }], title: 'Tags' },
      { name: 'portfolio', type: 'array', of: [{ type: 'image' }], title: 'Portfolio' },
      { name: 'deliveryTimeEstimate', type: 'number', title: 'Delivery Time Estimate' },
    ],
  };