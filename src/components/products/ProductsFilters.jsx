import React from 'react';
import { CATEGORIES_DATA } from './hooks/useProductFilters';
import './products.css';

const ProductsFilters = ({ 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy 
}) => {
  return (
    <aside className="filters-sidebar">
      {/* Filtro de Categorias */}
      <div className="filter-group">
        <h3>Categorias</h3>
        <div className="category-list">
          {CATEGORIES_DATA.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ordenação */}
      <div className="filter-group">
        <h3>Ordenar por</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="nome">Nome (A-Z)</option>
          <option value="preco-asc">Preço (Menor)</option>
          <option value="preco-desc">Preço (Maior)</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductsFilters;
