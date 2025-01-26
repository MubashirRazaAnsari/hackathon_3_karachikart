import { serverClient } from '@/sanity/lib/client';

async function getStats() {
  const stats = await serverClient.fetch(`{
    "totalProducts": count(*[_type == "newProduct"]),
    "totalUsers": count(*[_type == "user"]),
    "totalOrders": count(*[_type == "order"]),
    "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
      _id,
      total,
      status,
      user->{name},
      _createdAt
    }
  }`);
  return stats;
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-3">{order._id.slice(-6)}</td>
                    <td className="py-3">{order.user?.name || 'Anonymous'}</td>
                    <td className="py-3">${order.total}</td>
                    <td className="py-3">{order.status}</td>
                    <td className="py-3">
                      {new Date(order._createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 