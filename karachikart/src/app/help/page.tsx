'use client';

import { useState } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';

interface HelpCategory {
  id: string;
  title: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
}

const helpData: HelpCategory[] = [
  {
    id: 'orders',
    title: 'Orders & Shipping',
    articles: [
      {
        id: 'track-order',
        title: 'How to track my order?',
        content: 'You can track your order by...',
      },
      {
        id: 'shipping-time',
        title: 'Shipping times and methods',
        content: 'Our standard shipping takes...',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    articles: [
      {
        id: 'return-policy',
        title: 'Return Policy',
        content: 'You can return items within 30 days...',
      },
      {
        id: 'refund-process',
        title: 'Refund Process',
        content: 'Refunds are processed within...',
      },
    ],
  },
  // Add more categories
];

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const filteredCategories = helpData.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.articles.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Help Center</h1>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Help Categories */}
        <div className="md:col-span-2">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="mb-8">
                <h2 className="text-xl font-bold mb-4">{category.title}</h2>
                <div className="space-y-4">
                  {category.articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {article.content}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No help articles found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <a
                  href="mailto:support@example.com"
                  className="text-blue-600 hover:underline"
                >
                  support@example.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <a
                  href="tel:+1234567890"
                  className="text-blue-600 hover:underline"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-gray-400" />
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Submit a Request</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="prose max-w-none">
              <p>{selectedArticle.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 