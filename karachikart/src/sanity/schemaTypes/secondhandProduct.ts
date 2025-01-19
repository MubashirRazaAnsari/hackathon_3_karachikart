export default {
    name: 'secondhandProduct',
    type: 'document',
    title: 'Product',
    fields: [
      { name: 'productId', type: 'string', title: 'Product ID' },
      { name: 'name', type: 'string', title: 'Name' },
      { name: 'productImage' , type:'image', title: 'Product Image' ,options:{
        hotspot : true
      }},

      { name: 'price', type: 'number', title: 'Price' },
      { name: 'stock', type: 'number', title: 'Stock' },
      { name: 'sellerId', type: 'reference', to: [{ type: 'seller' }], title: 'Seller' },
      { name: 'description', type: 'text', title: 'Description' },
      { 
        name: 'condition', 
        type: 'string', 
        title: 'Condition', 
        options: { list: ['New-like', 'Second-Hand'] } 
      },
      { name: 'category', type: 'reference', to: [{ type: 'category' }], title: 'Category' },
      { name: 'tags', type: 'array', of: [{ type: 'string' }], title: 'Tags' },
    ],
  };