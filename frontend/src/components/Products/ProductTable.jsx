import React from 'react';

function StockBadge({ qty }) {
  let color = 'bg-green-100 text-green-700';
  if (qty === 0) color = 'bg-red-100 text-red-700';
  else if (qty < 10) color = 'bg-amber-100 text-amber-700';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {qty}
    </span>
  );
}

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-gray-500">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No products found.</td></tr>
          ) : products.map((p) => (
            <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-gray-500">{p.sku}</td>
              <td className="px-4 py-3">₹{Number(p.price).toFixed(2)}</td>
              <td className="px-4 py-3"><StockBadge qty={p.stock_qty} /></td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(p)} className="mr-2 text-blue-600 hover:text-blue-800">Edit</button>
                <button onClick={() => onDelete(p)} className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
