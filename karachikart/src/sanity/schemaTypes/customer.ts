export default {
    name: 'customer',
    type: 'document',
    title: 'Customer',
    fields: [
      { name: 'customerId', type: 'string', title: 'Customer ID'},
      { name: 'name', type: 'string', title: 'Name' },
      { name: 'contactInfo', type: 'object', fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
      ], title: 'Contact Info' },
      { name: 'address', type: 'object', fields: [
        { name: 'street', type: 'string', title: 'Street' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
      ], title: 'Address' },
      { name: 'orderHistory', type: 'array', of: [{ type: 'reference', to: [{ type: 'order' }] }], title: 'Order History' },
      { name: 'wishlist', type: 'array', of: [{ type: 'reference', to: [{ type: 'newProduct' }] }], title: 'Wishlist' },
      { name: 'joinedDate', type: 'datetime', title: 'Joined Date' },
    ],
  };
  