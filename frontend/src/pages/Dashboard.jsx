import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/UI/StatCard';
import Spinner from '../components/UI/Spinner';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={data?.total_products ?? 0} color="blue" icon={<span className="text-xl">📦</span>} />
        <StatCard label="Total Customers" value={data?.total_customers ?? 0} color="green" icon={<span className="text-xl">👥</span>} />
        <StatCard label="Total Orders" value={data?.total_orders ?? 0} color="purple" icon={<span className="text-xl">🛒</span>} />
        <StatCard label="Total Revenue" value={`₹${Number(data?.total_revenue ?? 0).toFixed(2)}`} color="amber" icon={<span className="text-xl">💰</span>} />
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-amber-700">Low Stock Alerts</h3>
        {(data?.low_stock_products ?? []).length === 0 ? (
          <p className="text-gray-500">All products have sufficient stock.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">SKU</th>
                  <th className="pb-2 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{p.sku}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.stock_qty === 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.stock_qty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
