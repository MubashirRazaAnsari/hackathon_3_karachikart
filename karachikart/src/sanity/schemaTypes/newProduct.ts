const newProductSchema = {
    name: 'newProduct',
    type: 'document',
    title: 'New Product',
    fields: [
      { name: 'productId', type: 'string', title: 'Product ID'},
      { name: 'productImage' , type:'image', title: 'Product Image' ,options:{
        hotspot : true
      }},
      { name: 'name', type: 'string', title: 'Name', validation: (Rule: any) => Rule.required() },
      { name: 'price', type: 'number', title: 'Price', validation: (Rule: any) => Rule.required().positive() },
      { name: 'stock', type: 'number', title: 'Stock', validation: (Rule: any) => Rule.required().min(0) },
      { name: 'sellerId', type: 'reference', to: [{ type: 'seller' }], title: 'Seller' },
      { name: 'description', type: 'text', title: 'Description' },
      { name: 'category', type: 'reference', to: [{ type: 'category' }], title: 'Category' },
      { name: 'tags', type: 'array', of: [{ type: 'string' }], title: 'Tags' },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        validation: (Rule: any) => Rule.min(0).max(5),
      },
      {
        name: 'isFeatured',
        title: 'Featured Product',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'reviews',
        title: 'Reviews',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'review' }] }],
      },
    ],
  };

export default newProductSchema;