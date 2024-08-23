import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Routes, Route } from 'react-router-dom';

import ProductCard from './ProductCard';
import { useInView } from 'react-intersection-observer';


const shuffleArray = (array) => {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ProductsList = ({ searchTerm, storeId }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/productDetail.php');
        if (response.data && !response.data.error) {
          setProducts(response.data.allProducts || []);
        } else {
          setError(response.data.error || 'No products found');
        }
      } catch (err) {
        setError('Error fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {

    const filtered = products.filter(product => {
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStoreId = !storeId || product.store_id === Number(storeId);
      return matchesSearchTerm && matchesStoreId;
    });


    const shuffledProducts = shuffleArray(filtered);

    setFilteredProducts(shuffledProducts);
    setVisibleProducts(shuffledProducts.slice(0, 10));
  }, [searchTerm, storeId, products]);

  useEffect(() => {

    if (inView && visibleProducts.length < filteredProducts.length) {

      const loadMoreProducts = setTimeout(() => {
        const nextBatch = filteredProducts.slice(visibleProducts.length, visibleProducts.length + 10);
        setVisibleProducts((prev) => [...prev, ...nextBatch]);
      }, 1000);

      return () => clearTimeout(loadMoreProducts);
    }
  }, [inView, filteredProducts, visibleProducts.length]);

  if (loading) {
    return <div className="text-center m-10 ml-1">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 m-10 ml-1">{error}</div>;
  }

  if (!filteredProducts.length) {
    return <div className="text-center m-10 ml-1">No products found</div>;
  }

  return (
    <div>
     
      <h2 className="text-xl font-bold py-2">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 m-6 ml-1">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
      {visibleProducts.length < filteredProducts.length && (
        <div ref={ref} className="text-center py-4">
          Loading more products...
        </div>
      )}
    </div>
  );
};

export default ProductsList;
