import React from 'react';
import './products.css';

const ProductsContainer = ({ children }) => {
  return (
    <div className="products-content">
      <div className="section-container">
        {children}
      </div>
    </div>
  );
};

export default ProductsContainer;
