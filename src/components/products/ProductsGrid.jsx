import React from 'react';
import ProductCard from './ProductCard';
import './products.css';

const ProductsGrid = ({ products, productCount }) => {
  if (productCount === 0) {
    return (
      <div className="no-products">
        <p>Nenhum produto encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
