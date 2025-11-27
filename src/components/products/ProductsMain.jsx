import React from 'react';
import ProductsGrid from './ProductsGrid';
import './products.css';

const ProductsMain = ({ products, productCount }) => {
  return (
    <div className="products-main">
      <div className="products-info">
        <p className="product-count">
          Mostrando {productCount} produto{productCount !== 1 ? 's' : ''}
        </p>
      </div>

      <ProductsGrid 
        products={products} 
        productCount={productCount}
      />
    </div>
  );
};

export default ProductsMain;
