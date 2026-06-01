import React from 'react';
import { useForm } from 'react-hook-form';

export default function ProductForm({ initial, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initial || { name: '', sku: '', price: '', stock_qty: 1, description: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input {...register('name', { required: 'Name is required' })}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">SKU</label>
        <input {...register('sku', { required: 'SKU is required' })}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" step="0.01" {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be >= 0' } })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Qty</label>
          <input type="number" {...register('stock_qty', { required: 'Stock is required', min: { value: 0, message: 'Must be >= 0' } })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          {errors.stock_qty && <p className="mt-1 text-xs text-red-600">{errors.stock_qty.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea {...register('description')} rows={2}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
