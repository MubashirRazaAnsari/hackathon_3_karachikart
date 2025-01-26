const servicesSchema = {
  name: 'services',
  title: 'Services',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Service Name',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: (Rule: any) => Rule.required().min(0)
    },
    {
      name: 'image',
      title: 'Service Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'All Services', value: 'all' },
          { title: '── Home Services ──', value: 'divider1' },
          { title: 'Home Maintenance', value: 'home-maintenance' },
          { title: 'Cleaning', value: 'cleaning' },
          { title: 'Plumbing', value: 'plumbing' },
          { title: 'Electrical', value: 'electrical' },
          { title: 'Painting', value: 'painting' },
          { title: 'Carpentry', value: 'carpentry' },
          { title: 'HVAC', value: 'hvac' },
          { title: '── Tech Services ──', value: 'divider2' },
          { title: 'Web Development', value: 'web-development' },
          { title: 'Mobile App Development', value: 'mobile-development' },
          { title: 'UI/UX Design', value: 'ui-ux-design' },
          { title: 'Digital Marketing', value: 'digital-marketing' },
          { title: 'IT Support', value: 'it-support' },
          { title: '── Professional Services ──', value: 'divider3' },
          { title: 'Business Consulting', value: 'business-consulting' },
          { title: 'Legal Services', value: 'legal' },
          { title: 'Accounting', value: 'accounting' },
          { title: 'Translation', value: 'translation' },
          { title: '── Personal Services ──', value: 'divider4' },
          { title: 'Personal Training', value: 'personal-training' },
          { title: 'Life Coaching', value: 'life-coaching' },
          { title: 'Tutoring', value: 'tutoring' },
          { title: 'Photography', value: 'photography' },
          { title: '── Automotive ──', value: 'divider5' },
          { title: 'Car Repair', value: 'car-repair' },
          { title: 'Car Wash', value: 'car-wash' },
          { title: 'Car Detailing', value: 'car-detailing' },
          { title: '── Events & Entertainment ──', value: 'divider6' },
          { title: 'Event Planning', value: 'event-planning' },
          { title: 'DJ Services', value: 'dj-services' },
          { title: 'Catering', value: 'catering' },
          { title: '── Other Services ──', value: 'divider7' },
          { title: 'Moving', value: 'moving' },
          { title: 'Pet Care', value: 'pet-care' },
          { title: 'Landscaping', value: 'landscaping' },
          { title: 'Custom Services', value: 'custom' }
        ]
      },
      validation: (Rule: any) => Rule.required().custom((value: string) => {
        if (value.includes('divider')) {
          return 'Please select a valid category';
        }
        return true;
      })
    },
    {
      name: 'duration',
      type: 'string',
      title: 'Service Duration',
      description: 'e.g., "2 hours", "1 day"',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'availability',
      type: 'array',
      title: 'Availability',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '24/7', value: '24/7' },
          { title: '9am-5pm', value: '9am-5pm' },
          { title: '10am-6pm', value: '10am-6pm' },
          { title: '11am-7pm', value: '11am-7pm' },
          { title: '12pm-8pm', value: '12pm-8pm' },
          { title: '1pm-9pm', value: '1pm-9pm' },
          { title: '2pm-10pm', value: '2pm-10pm' },
        ]
      }
    },
    {
      name: 'provider',
      title: 'Service Provider',
      type: 'reference',
      to: [{ type: 'serviceProvider' }],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'status',
      title: 'Service Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Unavailable', value: 'unavailable' },
          { title: 'Coming Soon', value: 'coming-soon' }
        ]
      },
      initialValue: 'available'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image'
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: `Category: ${subtitle}`,
        media
      };
    }
  }
};

export default servicesSchema;