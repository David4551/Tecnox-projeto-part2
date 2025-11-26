import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../../components/header/index.jsx';
import Footer from '../../components/footer/index.jsx';
import './index.css';
import { addItem } from '../../utils/cart.js';
import { API_BASE_URL } from '../../utils/config.js';

// --- Dados de Configuração ---
const CATEGORIES_DATA = [
  { id: 'todos', label: 'Todos os Produtos' },
  { id: 'monitores', label: 'Monitores' },
  { id: 'computadores', label: 'Computadores' },
  { id: 'placas-de-video', label: 'Placas de Vídeo' },
  { id: 'fontes', label: 'Fontes' },
  { id: 'gabinetes', label: 'Gabinetes' },
];

// --- Componente de Lógica/Dados ---

/**
 * Hook customizado para buscar produtos e gerenciar o estado
 */
const useProductsData = () => {
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

// --- Componentes de Apresentação/UI ---

/**
 * Componente para renderizar um único Card de Produto
 */
const ProductCard = React.memo(({ product }) => {
  // Função para adicionar ao carrinho (envolve o toast)
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


/**
 * Componente para gerenciar a lista de produtos, filtros e ordenação
 */
const ProductsList = ({ allProducts, loading, error }) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('nome');

  // Memoização para filtrar e ordenar produtos APENAS quando as dependências mudarem
  const filteredAndSortedProducts = useMemo(() => {
    let products = selectedCategory === 'todos'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory);

    // Cria uma cópia para ordenar sem modificar o array original 'allProducts' ou o array filtrado
    products = [...products]; 

    if (sortBy === 'nome') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'preco-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'preco-desc') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [allProducts, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="products-main">
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-main">
        <p className="error-message">Erro: {error}</p>
      </div>
    );
  }

  const productCount = filteredAndSortedProducts.length;

  return (
    <div className="products-content">
      <div className="section-container">
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

        <div className="products-main">
          <div className="products-info">
            <p className="product-count">
              Mostrando {productCount} produto{productCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="products-grid">
            {productCount > 0 ? (
              filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="no-products">
                <p>Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Componente Principal da Página ---

const Produtos = () => {
  // Chamada do Hook customizado para obter dados
  const { allProducts, loading, error } = useProductsData();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <section className="products-hero">
          <div className="section-container">
            <h1>Produtos</h1>
            <p>Encontre as melhores peças para montar seu PC</p>
          </div>
        </section>
        
        {/* Componente que engloba toda a lógica de filtragem/ordenação e a lista */}
        <ProductsList 
          allProducts={allProducts}
          loading={loading}
          error={error}
        />
      </main>
      <Footer />
    </>
  );
};

export default Produtos;