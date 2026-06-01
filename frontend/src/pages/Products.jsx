import React, { useState } from 'react';
import useProducts from '../hooks/useProducts';
import ProductTable from '../components/Products/ProductTable';
import ProductForm from '../components/Products/ProductForm';
import Modal from '../components/UI/Modal';
import Spinner from '../components/UI/Spinner';
import { useToast } from '../components/UI/Toast';

export default function Products() {
  const { products, total, loading, page, setPage, search, setSearch, create, update, remove, refetch } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  const totalPages = Math.ceil(total / 20);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await update(editing.id, data);
        toast('Product updated successfully');
      } else {
        await create(data);
        toast('Product created successfully');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      toast('Product deleted');
    } catch (err) {
      toast(err.message, 'error');
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <ProductTable products={products} onEdit={handleEdit} onDelete={setDeleting} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Product' : 'Add Product'}>
        <ProductForm initial={editing} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditing(null); }} />
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Confirm Delete">
        <p className="mb-4 text-gray-600">Are you sure you want to delete <strong>{deleting?.name}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleting(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
