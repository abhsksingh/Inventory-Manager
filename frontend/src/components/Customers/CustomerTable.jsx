import React from 'react';

export default function CustomerTable({ customers, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-gray-500">
            <th className="px-4 py-3 font-medium">Full Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No customers found.</td></tr>
          ) : customers.map((c) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{c.full_name}</td>
              <td className="px-4 py-3 text-gray-500">{c.email}</td>
              <td className="px-4 py-3 text-gray-500">{c.phone || '—'}</td>
              <td className="px-4 py-3 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onDelete(c)} className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
