const secondhandProductSchema = {
    name: 'secondhandProduct',
    title: 'Secondhand Product',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule: { required: () => any; }) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        validation: (Rule: { required: () => any; }) => Rule.required(),
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: (Rule: { required: () => { (): any; new(): any; min: { (arg0: number): any; new(): any; }; }; }) => Rule.required().min(0),
      },
      {
        name: 'productImage',
        title: 'Product Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule: { required: () => any; }) => Rule.required(),
      },
      {
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{ type: 'category' }],
        validation: (Rule: { required: () => any; }) => Rule.required(),
      },
      {
        name: 'condition',
        title: 'Condition',
        type: 'string',
        options: {
          list: [
            { title: 'Like New', value: 'likeNew' },
            { title: 'Very Good', value: 'veryGood' },
            { title: 'Good', value: 'good' },
            { title: 'Fair', value: 'fair' },
          ],
        },
        validation: (Rule: { required: () => any; }) => Rule.required(),
      },
      {
        name: 'seller',
        title: 'Seller',
        type: 'reference',
        to: [{ type: 'user' }],
        validation: (Rule: { required: () => any; }) => Rule.required(),
      },
      {
        name: 'location',
        title: 'Location',
        type: 'string',
        validation: (Rule: { required: () => any; }) => Rule.required(),
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
          list: [
            { title: 'Available', value: 'available' },
            { title: 'Sold', value: 'sold' },
            { title: 'Reserved', value: 'reserved' },
          ],
        },
        initialValue: 'available',
      },
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'price',
        media: 'productImage',
      },
      prepare(selection: { media?: any; title?: any; subtitle?: any; }) {
        const { title, subtitle } = selection;
        return {
          title: title,
          subtitle: `$${subtitle}`,
          media: selection.media,
        };
      },
    },
  };

export default secondhandProductSchema;