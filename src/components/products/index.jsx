import React from 'react';
import ProductsLayout from './ProductsLayout';
import ProductsHero from './ProductsHero';
import ProductsContainer from './ProductsContainer';
import ProductsFilters from './ProductsFilters';
import ProductsMain from './ProductsMain';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useProductsData } from './hooks/useProductsData';
import { useProductFilters } from './hooks/useProductFilters';

const ProductsPage = () => {
  const { allProducts, loading, error } = useProductsData();
  
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredAndSortedProducts,
    productCount
  } = useProductFilters(allProducts);

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} />;
    }

    return (
      <ProductsContainer>
        <ProductsFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <ProductsMain
          products={filteredAndSortedProducts}
          productCount={productCount}
        />
      </ProductsContainer>
    );
  };

  return (
    <ProductsLayout>
      <ProductsHero />
      {renderContent()}
    </ProductsLayout>
  );
};

export default ProductsPage;
