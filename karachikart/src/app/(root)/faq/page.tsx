'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I place an order?',
    answer: 'You can place an order by selecting the items you want, adding them to your cart, and proceeding to checkout. Follow the steps to enter your shipping and payment information.',
    category: 'Orders',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers. Payment information is securely processed through our payment gateway.',
    category: 'Payment',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.',
    category: 'Shipping',
  },
  // Add more FAQs as needed
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (index: number) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(index)) {
      newOpenQuestions.delete(index);
    } else {
      newOpenQuestions.add(index);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full ${
            activeCategory === 'All'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full ${
              activeCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50"
            >
              <span className="font-medium text-left">{faq.question}</span>
              {openQuestions.has(index) ? (
                <FaChevronUp className="flex-shrink-0 ml-2" />
              ) : (
                <FaChevronDown className="flex-shrink-0 ml-2" />
              )}
            </button>
            {openQuestions.has(index) && (
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <p className="text-center text-gray-600 mt-8">
          No FAQs found matching your criteria.
        </p>
      )}
    </div>
  );
} 