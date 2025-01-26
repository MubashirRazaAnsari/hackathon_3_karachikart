export default {
  name: 'user',
  type: 'document',
  title: 'User',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'password',
      type: 'string',
      title: 'Password',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'role',
      type: 'string',
      title: 'Role',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Admin', value: 'admin' },
          { title: 'Seller', value: 'seller' },
          { title: 'Service Provider', value: 'service_provider' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'customerId',
      type: 'reference',
      title: 'Customer Reference',
      to: [{ type: 'customer' }],
      hidden: ({ document }: { document: any }) => document?.role !== 'customer',
    },
    {
      name: 'sellerId',
      type: 'reference',
      title: 'Seller Reference',
      to: [{ type: 'seller' }],
      hidden: ({ document }: { document: any }) => document?.role !== 'seller',
    },
    {
      name: 'serviceProviderId',
      type: 'reference',
      title: 'Service Provider Reference',
      to: [{ type: 'serviceProvider' }],
      hidden: ({ document }: { document: any }) => document?.role !== 'service_provider',
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      readOnly: true,
    },
    {
      name: 'lastLogin',
      type: 'datetime',
      title: 'Last Login',
    },
  ],
  indexes: [
    {
      name: 'email',
      spec: {
        unique: true,
        fields: ['email'],
      },
    },
  ],
} 