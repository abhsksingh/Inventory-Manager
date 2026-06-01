import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/customers', { params: { page, limit } });
      setCustomers(data.data);
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

  const create = async (customer) => {
    const { data } = await api.post('/customers', customer);
    await fetch();
    return data;
  };

  const remove = async (id) => {
    await api.delete(`/customers/${id}`);
    await fetch();
  };

  return { customers, total, loading, page, setPage, create, remove, refetch: fetch };
}
