'use client';

import Image from 'next/image';
import { FaShippingFast, FaUserShield, FaHeadset, FaMoneyBillWave } from 'react-icons/fa';

const features = [
  {
    icon: FaShippingFast,
    title: 'Fast Delivery',
    description: 'Get your products delivered quickly and securely anywhere in the country.',
  },
  {
    icon: FaUserShield,
    title: 'Secure Shopping',
    description: 'Your security is our top priority. Shop with confidence using our secure platform.',
  },
  {
    icon: FaHeadset,
    title: '24/7 Support',
    description: 'Our customer service team is available around the clock to assist you.',
  },
  {
    icon: FaMoneyBillWave,
    title: 'Best Prices',
    description: 'We offer competitive prices and regular deals to save you money.',
  },
];

const team = [
  {
    name: 'Mubashir R.',
    role: ['CEO & Founder', 'Developer' , 'Designer' , 'Marketing' , 'Customer Service' , 'Sole Proprietor'],
    image: '/images/team/Mubashir.jpeg',
  },
  // Add more team members
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About KarachiKART</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted destination for quality products and exceptional shopping experience.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Story Section */}
      <div className="bg-white rounded-lg shadow p-8 mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in December 2024, KarachiKART is a growing e-commerce platform in Pakistan. Our journey began with a simple
            mission: to provide quality products at affordable prices while delivering
            exceptional customer service.
          </p>
          <p className="text-gray-600">
            Our goal is to serve thousands of customers across the country, offering a wide
            range of products from trusted brands and sellers. Our commitment to
            customer satisfaction and continuous innovation drives us to improve and
            expand our services constantly.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        {/* <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => ( */}
            <div
              
              className="bg-white w-[300px] mx-auto rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={'/images/team/Mubashir.jpeg'}
                  alt={'Mubashir Raza'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1">Mubashir R.</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
            </div>
          {/* ))}
        </div> */}
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions or want to learn more about our company? We'd love to hear from you.
          </p>
          <button onClick={() => window.location.href = 'mailto:.com'} className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
} 