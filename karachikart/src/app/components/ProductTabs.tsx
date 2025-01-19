'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface TabProps {
  isActive: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}

const Tab = ({ isActive, label, count, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`px-8 py-4 font-medium transition-colors ${
      isActive 
        ? 'bg-[#FF9F0D] text-white' 
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
  >
    {label} {count && `(${count})`}
  </button>
);

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-16">
        {/* Tabs */}
        <div className="flex border-b">
          <Tab
            isActive={activeTab === 'description'}
            label="Description"
            onClick={() => setActiveTab('description')}
          />
          <Tab
            isActive={activeTab === 'reviews'}
            label="Reviews"
            count={24}
            onClick={() => setActiveTab('reviews')}
          />
        </div>

        {/* Tab Content */}
        <div className="bg-white p-8">
          {activeTab === 'description' ? (
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Nam tristique porta ligula, vel viverra sem eleifend nec. Nulla sed purus augue, eu euismod tellus. Nam mattis eros nec mi sagittis sagittis. Vestibulum suscipit cursus bibendum. Integer at justo eget sem auctor auctor eget vitae arcu. Nam tempor malesuada porttitor. Nulla quis dignissim ipsum. Aliquam pulvinar iaculis justo, sit amet interdum sem hendrerit vitae. Vivamus vel erat tortor. Nulla facilisi. In nulla quam, lacinia eu aliquam ac, aliquam in nisl.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Suspendisse cursus sodales placerat. Morbi eu lacinia ex. Curabitur blandit justo urna, id porttitor est dignissim nec. Pellentesque scelerisque hendrerit posuere. Sed at dolor quis nisi rutrum accumsan et sagittis massa. Aliquam aliquam accumsan lectus quis auctor. Curabitur rutrum massa at volutpat placerat. Duis sagittis vehicula fermentum. Integer eu vulputate justo. Aenean pretium odio vel tempor sodales. Suspendisse eu fringilla leo, non aliquet sem.
              </p>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Key Benefits</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                  <li>Maecenas ullamcorper est et massa mattis condimentum.</li>
                  <li>Vestibulum sed massa vel ipsum imperdiet malesuada id tempus nisl.</li>
                  <li>Etiam nec massa et lectus faucibus ornare congue in nunc.</li>
                  <li>Mauris eget diam magna, in blandit turpis.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Reviews Section */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Customer Reviews (24)</h3>
              </div>
              
              {/* Sample Reviews */}
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-semibold">John Doe</span> on{" "}
                      <span>Aug 24, 2023</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam
                    pellentesque bibendum non dui volutpat fringilla bibendum.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;