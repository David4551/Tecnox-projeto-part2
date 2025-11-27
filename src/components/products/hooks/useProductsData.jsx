import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../utils/config.js';

export const useProductsData = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const base = API_BASE_URL;
        if (!base) throw new Error('API_BASE_URL não configurada');
        const res = await fetch(`${base}/produtos`);
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        const data = await res.json();
        const main = (Array.isArray(data) ? data : []).filter(
          (p) => !p.segment || p.segment === 'produtos'
        );
        setAllProducts(main);
      } catch (e) {
        setError(e.message || 'Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { allProducts, loading, error };
};
