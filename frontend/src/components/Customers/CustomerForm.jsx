import React from 'react';
import { useForm } from 'react-hook-form';

export default function CustomerForm({ onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { full_name: '', email: '', phone: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input {...register('full_name', { required: 'Name is required' })}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input {...register('phone')}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Create</button>
      </div>
    </form>
  );
}
