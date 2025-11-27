import React from 'react';
import Header from '../header/index.jsx';
import Footer from '../footer/index.jsx';

const ProductsLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default ProductsLayout;
