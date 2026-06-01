import React, { useState } from 'react';
import useCustomers from '../hooks/useCustomers';
import CustomerTable from '../components/Customers/CustomerTable';
import CustomerForm from '../components/Customers/CustomerForm';
import Modal from '../components/UI/Modal';
import Spinner from '../components/UI/Spinner';
import { useToast } from '../components/UI/Toast';

export default function Customers() {
  const { customers, total, loading, page, setPage, create, remove, refetch } = useCustomers();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  const totalPages = Math.ceil(total / 20);

  const handleSave = async (data) => {
    try {
      await create(data);
      toast('Customer created successfully');
      setModalOpen(false);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      toast('Customer deleted');
    } catch (err) {
      toast(err.message, 'error');
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Add Customer
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <CustomerTable customers={customers} onDelete={setDeleting} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Customer">
        <CustomerForm onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Confirm Delete">
        <p className="mb-4 text-gray-600">Are you sure you want to delete <strong>{deleting?.full_name}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleting(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
