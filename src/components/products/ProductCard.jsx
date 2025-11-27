import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { addItem } from '../../utils/cart.js';
import './products.css';

const ProductCard = React.memo(({ product }) => {
  const handleAddToCart = useCallback(() => {
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.imgSrc,
      type: product.category || 'product',
    }, 1);
    toast.success('Adicionado ao carrinho');
  }, [product]);

  return (
    <div className="product-card">
      <Link
        to={`/produto/${product.id}`}
        state={{ product }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="product-image">
          <img src={product.imgSrc} alt={product.name} />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-price">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </Link>
      <div className="product-info">
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
