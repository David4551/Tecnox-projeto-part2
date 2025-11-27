import { useState, useMemo } from 'react';

export const CATEGORIES_DATA = [
  { id: 'todos', label: 'Todos os Produtos' },
  { id: 'monitores', label: 'Monitores' },
  { id: 'computadores', label: 'Computadores' },
  { id: 'placas-de-video', label: 'Placas de Vídeo' },
  { id: 'fontes', label: 'Fontes' },
  { id: 'gabinetes', label: 'Gabinetes' },
];

export const useProductFilters = (products) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('nome');

  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = selectedCategory === 'todos'
      ? products
      : products.filter(p => p.category === selectedCategory);

    // Cria uma cópia para ordenar sem modificar o array original
    const sortedProducts = [...filteredProducts];

    if (sortBy === 'nome') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'preco-asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'preco-desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    return sortedProducts;
  }, [products, selectedCategory, sortBy]);

  return {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredAndSortedProducts,
    productCount: filteredAndSortedProducts.length
  };
};
