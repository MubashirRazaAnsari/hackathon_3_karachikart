'use client';

import { FaShoppingBag, FaBox, FaUsers, FaDollarSign } from 'react-icons/fa';

interface StatsProps {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
}

export default function DashboardStats({ 
  totalOrders,
  totalProducts,
  totalCustomers,
  totalRevenue 
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<FaShoppingBag className="w-8 h-8 text-blue-500" />}
        title="Total Orders"
        value={totalOrders}
      />
      <StatCard
        icon={<FaBox className="w-8 h-8 text-green-500" />}
        title="Total Products"
        value={totalProducts}
      />
      <StatCard
        icon={<FaUsers className="w-8 h-8 text-purple-500" />}
        title="Total Customers"
        value={totalCustomers}
      />
      <StatCard
        icon={<FaDollarSign className="w-8 h-8 text-yellow-500" />}
        title="Total Revenue"
        value={`$${totalRevenue.toFixed(2)}`}
      />
    </div>
  );
}

function StatCard({ icon, title, value }: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        {icon}
      </div>
    </div>
  );
} 