const sellerSchema = {
  name: 'seller',
  title: 'Seller',
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
      name: 'businessDetails',
      title: 'Business Details',
      type: 'object',
      fields: [
        { name: 'businessName', type: 'string' },
        { name: 'businessAddress', type: 'string' },
        { name: 'taxId', type: 'string' },
      ],
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'newProduct' }] }],
    },
    {
      name: 'joinedDate',
      title: 'Joined Date',
      type: 'datetime',
    },
  ],
};

export default sellerSchema; 