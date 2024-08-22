import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Ensure this path is correct
import { useInView } from 'react-intersection-observer';

const SapplingsList = ({ searchTerm, storeId }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/productDetail.php');
        if (response.data && !response.data.error) {
          const spiceProducts = response.data.allProducts.filter(product => product.category_id === 14);
          const shuffledProducts = shuffleArray(spiceProducts);
          setProducts(shuffledProducts);
          setFilteredProducts(shuffledProducts); // Initially set filteredProducts to all spices
          setVisibleProducts(shuffledProducts.slice(0, 10)); // Initially show only the first 10 products
        } else {
          setError(response.data.error || 'No products found');
        }
      } catch (err) {
        setError('Error fetching products');
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!storeId || product.store_id === Number(storeId))
    );
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(0, 10)); // Reset visible products when filtering
  }, [searchTerm, storeId, products]);

  useEffect(() => {
    // Lazy load more products when the user scrolls near the bottom
    if (inView && visibleProducts.length < filteredProducts.length) {
      // Introduce a delay before loading the next batch of products
      const loadMoreProducts = setTimeout(() => {
        const nextBatch = filteredProducts.slice(visibleProducts.length, visibleProducts.length + 10);
        setVisibleProducts((prev) => [...prev, ...nextBatch]);
      }, 1000); // 1 second delay

      return () => clearTimeout(loadMoreProducts); // Clear timeout if component unmounts or re-renders
    }
  }, [inView, filteredProducts, visibleProducts.length]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  if (error) {
    return <div className="text-center text-red-500 m-10 ml-1">{error}</div>;
  }

  if (!filteredProducts.length) {
    return <div className="text-center m-10 ml-1">No products found</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold py-2">Plant Sapplings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-6 ml-1">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.product_id}
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

export default SapplingsList;