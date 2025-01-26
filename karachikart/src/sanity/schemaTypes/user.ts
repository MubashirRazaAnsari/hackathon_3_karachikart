const userSchema = {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: { required: () => any; }) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: { required: () => { (): any; new(): any; email: { (): any; new(): any; }; }; }) => Rule.required().email(),
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Seller', value: 'seller' },
          { title: 'Admin', value: 'admin' },
          { title: 'Service Provider', value: 'service-provider' }
        ]
      },
      initialValue: 'customer'
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'phone', type: 'string' },
        { name: 'address', type: 'string' },
      ],
    },
    {
      name: 'wishlist',
      title: 'Wishlist',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'newProduct' }]
        }
      ]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'image',
    },
  },
};

export default userSchema; 