import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders', { params: { page, limit } });
      setOrders(data.data);
      setTotal(data.total);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (order) => {
    const { data } = await api.post('/orders', order);
    await fetch();
    return data;
  };

  const getById = async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  };

  const remove = async (id) => {
    await api.delete(`/orders/${id}`);
    await fetch();
  };

  return { orders, total, loading, page, setPage, create, getById, remove, refetch: fetch };
}
