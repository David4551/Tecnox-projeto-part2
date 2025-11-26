import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../../components/header/index.jsx';
import Footer from '../../components/footer/index.jsx';
import './index.css';
import { getCart, updateQty, removeItem, setCheckoutItems, formatBRL } from '../../utils/cart.js';

// --- Ícones e Componentes de Apresentação ---

/**
 * Ícone de Lixeira (TrashIcon)
 */
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

/**
 * Componente do Item Individual no Carrinho
 */
const CartItem = React.memo(({ item, onQtyChange, onRemove }) => {
    const itemKey = `${item.type}-${item.id}`;
    const itemSubtotal = (item.price || 0) * (item.quantity || 1);

    const handleInput = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1) {
            onQtyChange(item.id, item.type, value);
        }
    };

    return (
        <div key={itemKey} className="cart-item">
            <div className="product-details" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={item.image || '/fallback.svg'} alt={item.title} />
                <span>{item.title}</span>
            </div>
            <span className="item-price" data-label="Preço">{formatBRL(item.price)}</span>
            <div className="quantity-selector" data-label="Quantidade">
                <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={handleInput}
                />
            </div>
            <span className="item-subtotal" data-label="Subtotal">{formatBRL(itemSubtotal)}</span>
            <button 
                className="remove-item-btn" 
                onClick={() => onRemove(item.id, item.type)}
            >
                <TrashIcon />
            </button>
        </div>
    );
});


/**
 * Componente do Resumo do Carrinho (Subtotal e Total)
 */
const CartSummary = ({ subtotal, itemsLength, onCheckout }) => (
    <div className="cart-summary-section">
        <h2>Carrinho Total</h2>
        <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
        </div>
        <div className="summary-row total">
            <span>Total</span>
            <span>{formatBRL(subtotal)}</span>
        </div>
        <Link 
            to="/checkout" 
            className="checkout-btn" 
            onClick={onCheckout}
            aria-disabled={itemsLength === 0}
        >
            Checkout
        </Link>
    </div>
);

// --- Hook de Lógica Customizada ---

//Hook customizado para gerenciar o estado e as ações do carrinho

const useCartLogic = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Carrega o carrinho na montagem
        setItems(getCart());
    }, []);

    // Calcula o subtotal e o total
    const subtotal = useMemo(
        () => items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0),
        [items]
    );

    // Handler para alterar a quantidade
    const handleQtyChange = useCallback((id, type, value) => {
        const updated = updateQty(id, type, value);
        setItems([...updated]);
    }, []);

    // Handler para remover item
    const handleRemove = useCallback((id, type) => {
        const updated = removeItem(id, type);
        setItems([...updated]);
        toast.success('Item removido do carrinho!');
    }, []);

    // Handler para o botão de checkout
    const handleCheckoutClick = useCallback((e) => {
        if (items.length === 0) {
            e.preventDefault();
            toast.error('Seu carrinho está vazio. Adicione itens para continuar.');
            return;
        }
        try {
            setCheckoutItems(items);
            // Se o setCheckoutItems for bem-sucedido, a navegação via <Link to="/checkout"> continua
        } catch (err) {
            e.preventDefault();
            // Evita a navegação se houver um erro
            toast.error('Não foi possível preparar o checkout. Tente novamente.');
        }
    }, [items]);

    return {
        items,
        subtotal,
        handleQtyChange,
        handleRemove,
        handleCheckoutClick,
        itemsLength: items.length
    };
};

// --- Componente Principal da Página ---

const CartPage = () => {
    // Usa o hook customizado para obter o estado e os handlers
    const { 
        items, 
        subtotal, 
        handleQtyChange, 
        handleRemove, 
        handleCheckoutClick,
        itemsLength
    } = useCartLogic();

    return (
        <div className="cart-page">
            <Header />
            <main className="cart-container">
                <h1>Seu Carrinho</h1>
                <div className="cart-layout">
                    
                    {/* Lista de Itens */}
                    <div className="cart-items-section">
                        <div className="cart-header">
                            <span className="header-product">Produto</span>
                            <span className="header-price">Preço</span>
                            <span className="header-quantity">Quantidade</span>
                            <span className="header-subtotal">Subtotal</span>
                        </div>
                        
                        {itemsLength === 0 ? (
                            <div className="cart-empty-message">
                                <span>Seu carrinho está vazio.</span>
                                <Link to="/produtos">Voltar para a Loja</Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <CartItem 
                                    key={`${item.type}-${item.id}`} 
                                    item={item} 
                                    onQtyChange={handleQtyChange}
                                    onRemove={handleRemove}
                                />
                            ))
                        )}
                    </div>
                    
                    {/* Resumo */}
                    <CartSummary 
                        subtotal={subtotal} 
                        itemsLength={itemsLength}
                        onCheckout={handleCheckoutClick}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;