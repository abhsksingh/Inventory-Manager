import React, { useState } from 'react';
import useOrders from '../hooks/useOrders';
import OrderTable from '../components/Orders/OrderTable';
import OrderForm from '../components/Orders/OrderForm';
import OrderDetail from '../components/Orders/OrderDetail';
import Modal from '../components/UI/Modal';
import Spinner from '../components/UI/Spinner';
import { useToast } from '../components/UI/Toast';

export default function Orders() {
  const { orders, total, loading, page, setPage, create, getById, remove, refetch } = useOrders();
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const toast = useToast();

  const totalPages = Math.ceil(total / 20);

  const handleCreate = async (data) => {
    try {
      await create(data);
      toast('Order created successfully');
      setFormOpen(false);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleViewDetail = async (order) => {
    setDetailLoading(true);
    setSelectedOrder(order);
    setDetailOpen(true);
    try {
      const full = await getById(order.id);
      setSelectedOrder(full);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      toast('Order cancelled and stock restored');
    } catch (err) {
      toast(err.message, 'error');
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setFormOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Create Order
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <OrderTable orders={orders} onView={handleViewDetail} onDelete={setDeleting} />
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Create Order">
        <OrderForm onSave={handleCreate} onCancel={() => setFormOpen(false)} />
      </Modal>

      <Modal open={detailOpen} onClose={() => { setDetailOpen(false); setSelectedOrder(null); }} title="Order Details">
        {detailLoading ? <Spinner /> : selectedOrder && <OrderDetail order={selectedOrder} />}
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Cancel Order">
        <p className="mb-4 text-gray-600">Cancel this order? Inventory will be restored.</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleting(null)} className="rounded-lg border px-4 py-2 text-sm">Keep</button>
          <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Cancel Order</button>
        </div>
      </Modal>
    </div>
  );
}
