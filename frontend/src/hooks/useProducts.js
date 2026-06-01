import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: { page, limit, search },
      });
      setProducts(data.data);
      setTotal(data.total);
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (product) => {
    const { data } = await api.post('/products', product);
    await fetch();
    return data;
  };

  const update = async (id, product) => {
    const { data } = await api.put(`/products/${id}`, product);
    await fetch();
    return data;
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    await fetch();
  };

  return { products, total, loading, page, setPage, search, setSearch, create, update, remove, refetch: fetch };
}
