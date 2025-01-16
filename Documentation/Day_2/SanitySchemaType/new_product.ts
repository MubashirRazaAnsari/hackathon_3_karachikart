export default {
    name: 'newProduct',
    type: 'document',
    title: 'Product',
    fields: [
      { name: 'productId', type: 'string', title: 'Product ID', readOnly: true },
      { name: 'name', type: 'string', title: 'Name' },
      { name: 'price', type: 'number', title: 'Price' },
      { name: 'stock', type: 'number', title: 'Stock' },
      { name: 'sellerId', type: 'reference', to: [{ type: 'seller' }], title: 'Seller' },
      { name: 'description', type: 'text', title: 'Description' },
      { name: 'category', type: 'reference', to: [{ type: 'category' }], title: 'Category' },
      { name: 'tags', type: 'array', of: [{ type: 'string' }], title: 'Tags' },
    ],
  };