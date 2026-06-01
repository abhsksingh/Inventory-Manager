import React from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderTable({ orders, onView, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-gray-500">
            <th className="px-4 py-3 font-medium">Order ID</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No orders found.</td></tr>
          ) : orders.map((o) => (
            <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50 cursor-pointer" onClick={() => onView(o)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}...</td>
              <td className="px-4 py-3 font-medium text-gray-900">{o.customer_name}</td>
              <td className="px-4 py-3 text-gray-500">{o.items?.length || 0}</td>
              <td className="px-4 py-3">₹{Number(o.total_amount).toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>
                  {o.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onDelete(o)} className="text-red-600 hover:text-red-800 text-xs">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
