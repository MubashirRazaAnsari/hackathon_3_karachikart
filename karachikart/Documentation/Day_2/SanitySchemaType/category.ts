export default {
    name: 'category',
    type: 'document',
    title: 'Category',
    fields: [
      { name: 'categoryId', type: 'string', title: 'Category ID', readOnly: true },
      { name: 'name', type: 'string', title: 'Name' },
      { name: 'subcategories', type: 'array', of: [{ type: 'string' }], title: 'Subcategories' },
      { name: 'tags', type: 'array', of: [{ type: 'string' }], title: 'Tags' },
    ],
  };