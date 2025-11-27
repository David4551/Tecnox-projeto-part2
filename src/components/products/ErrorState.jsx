import React from 'react';
import './products.css';

const ErrorState = ({ error }) => {
  return (
    <div className="products-main">
      <p className="error-message">Erro: {error}</p>
    </div>
  );
};

export default ErrorState;
