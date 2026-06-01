import React from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetail({ order }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Order ID</p>
          <p className="font-mono font-medium">{order.id}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
            {order.status}
          </span>
        </div>
        <div>
          <p className="text-gray-500">Customer</p>
          <p className="font-medium">{order.customer_name}</p>
        </div>
        <div>
          <p className="text-gray-500">Date</p>
          <p>{new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700">Items</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">Product</th>
              <th className="pb-2 font-medium">Qty</th>
              <th className="pb-2 font-medium text-right">Unit Price</th>
              <th className="pb-2 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="py-2 font-medium">{item.product_name}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2 text-right">₹{Number(item.unit_price).toFixed(2)}</td>
                <td className="py-2 text-right">₹{(Number(item.unit_price) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-semibold">
              <td colSpan={3} className="pt-2 text-right">Total</td>
              <td className="pt-2 text-right">₹{Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
