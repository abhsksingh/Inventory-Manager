import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function OrderForm({ onSave, onCancel }) {
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [lines, setLines] = useState([{ product_id: '', quantity: 1 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/customers', { params: { limit: 100 } }).then((r) => setCustomers(r.data.data));
    api.get('/products', { params: { limit: 100 } }).then((r) => setProducts(r.data.data));
  }, []);

  const addLine = () => setLines([...lines, { product_id: '', quantity: 1 }]);
  const removeLine = (i) => setLines(lines.filter((_, idx) => idx !== i));
  const updateLine = (i, field, value) => {
    const next = [...lines];
    next[i][field] = field === 'quantity' ? parseInt(value) || 0 : value;
    setLines(next);
  };

  const selectedProducts = lines.map((l) => {
    const p = products.find((pr) => pr.id === l.product_id);
    return p ? { ...p, qty: l.quantity } : null;
  });

  const totalAmount = selectedProducts.reduce((sum, item) => {
    return item ? sum + Number(item.price) * item.qty : sum;
  }, 0);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        customer_id: customerId,
        items: lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity })),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step indicators */}
      <div className="flex items-center gap-2 text-sm">
        {['Customer', 'Items', 'Review'].map((label, idx) => (
          <React.Fragment key={label}>
            {idx > 0 && <span className="text-gray-300">→</span>}
            <span className={step === idx + 1 ? 'font-semibold text-blue-600' : 'text-gray-400'}>{label}</span>
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
            <option value="">-- Choose a customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
            ))}
          </select>
          <div className="flex justify-end pt-4">
            <button disabled={!customerId} onClick={() => setStep(2)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Product</label>
                <select value={line.product_id} onChange={(e) => updateLine(i, 'product_id', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="">-- Select product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock_qty === 0}>
                      {p.name} (₹{Number(p.price).toFixed(2)}, stock: {p.stock_qty})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs text-gray-500 mb-1">Qty</label>
                <input type="number" min={1} value={line.quantity}
                  onChange={(e) => updateLine(i, 'quantity', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              {lines.length > 1 && (
                <button onClick={() => removeLine(i)} className="mb-0.5 text-red-500 hover:text-red-700 text-lg">&times;</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addLine} className="text-sm text-blue-600 hover:text-blue-800">+ Add another item</button>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="rounded-lg border px-4 py-2 text-sm">Back</button>
            <button disabled={lines.some((l) => !l.product_id)} onClick={() => setStep(3)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
              Review Order
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h4 className="font-medium">Order Summary</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-1">Product</th>
                <th className="pb-1">Qty</th>
                <th className="pb-1 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((item, i) => item && (
                <tr key={i}>
                  <td className="py-1">{item.name}</td>
                  <td className="py-1">{item.qty}</td>
                  <td className="py-1 text-right">₹{(Number(item.price) * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t font-semibold">
                <td colSpan={2} className="pt-2">Total</td>
                <td className="pt-2 text-right">₹{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className="rounded-lg border px-4 py-2 text-sm">Back</button>
            <button onClick={handleSubmit} disabled={saving}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Creating...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
