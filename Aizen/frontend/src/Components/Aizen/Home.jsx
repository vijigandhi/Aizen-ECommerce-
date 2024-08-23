import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Slider from 'react-slick';
import { useInView } from 'react-intersection-observer';
import Banner from './Banner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductCard from './ProductCard';
import Header from '../Header';
import Footer from '../Footer';
import Cart from '../cart/cart';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeId, setStoreId] = useState('');
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const images = [
    'http://localhost:8000/assets/images/banner-1.png',
    'http://localhost:8000/assets/images/banner-2.png',
    'http://localhost:8000/assets/images/banner-3.png',
  ];

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get('http://localhost:8000/controller/Admin/getCategories.php'),
          axios.get(`http://localhost:8000/controller/productDetail.php?store_id=${storeId}`),
        ]);

        if (categoriesResponse.data.length > 0) {
          setCategories(categoriesResponse.data);
        } else {
          setCategories([]);
        }

        setProducts(shuffleArray(productsResponse.data.allProducts || []));
        setPopularProducts(productsResponse.data.popularProducts || []);
        setVisibleProducts(productsResponse.data.allProducts.slice(0, 10)); // Initial load
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  useEffect(() => {
    if (inView && visibleProducts.length < products.length) {
      const loadMoreProducts = setTimeout(() => {
        const nextBatch = products.slice(visibleProducts.length, visibleProducts.length + 10);
        setVisibleProducts((prev) => [...prev, ...nextBatch]);
      }, 500); 
      return () => clearTimeout(loadMoreProducts);
    }
  }, [inView, products, visibleProducts.length]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (categoryName) => {
    const categoryUrlMap = {
      'Fruits': '/aizen/fresh-fruits',
      'Vegetables': '/aizen/fresh-vegetables',
      'Spices': '/aizen/spices',
      'Dry Fruits': '/aizen/dryfruits',
      'Meat, Fish & Eggs': '/aizen/meats',
      'Dairy Products':'/aizen/dairyproducts',
      'Atta & Rice': '/aizen/rice',
      'Plant Sapplings': '/aizen/sapplings'
      
    };

    const url = categoryUrlMap[categoryName] || '/aizen';
    navigate(url);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className='bg-white'>
      <Header />
      <div className="relative">
        <Banner images={images} />
      </div>
      <div className="container mx-auto p-4">
      <Routes>
            
            <Route path="/cart" element={<Cart />} />
          </Routes>
        {/* Top Products Section */}
        <section className="p-4 mb-4" style={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
          <h2 className="text-2xl font-bold text-center mb-4">Top Products</h2>
          <Slider
  dots={false}
  infinite={true}
  speed={500}
  slidesToShow={4}
  slidesToScroll={1}
  prevArrow={
    <div
      className="w-12 h-12 bg-white text-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer text-3xl absolute left-[-1.5rem] top-1/2 transform -translate-y-1/2 z-10"
    >
      
    </div>
  }
  nextArrow={
    <div
      className="w-12 h-12 bg-white text-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer text-3xl absolute right-[-1.5rem] top-1/2 transform -translate-y-1/2 z-10"
    >
    
    </div>
  }
  responsive={[
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ]}
>
  {popularProducts.slice(0, 10).map((product) => (
    <div key={product.id} className="p-2" onClick={() => handleProductClick(product.id)}>
      <ProductCard product={product} />
    </div>
  ))}
</Slider>


        </section>

        {/* Categories Section */}
        <section className="p-4 mb-4" style={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
          <h2 className="text-3xl font-bold text-center mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center p-4 cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleCategoryClick(category.name)}
              >
                <img
                  src={`http://localhost:8000/assets/images/${category.image}`}
                  alt={category.name}
                  className="w-full h-32 object-cover mb-4 rounded-lg transition-shadow hover:shadow-lg" 
                />
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        {/* <section className="p-4 mb-4" style={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
          <h2 className="text-2xl font-bold text-center mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleProducts.map((product) => (
              <div key={product.id} onClick={() => handleProductClick(product.id)}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {visibleProducts.length < products.length && (
            <div ref={ref} className="text-center py-4">
              Loading more products...
            </div>
          )}
        </section>   */}


      </div>
      <section className="w-full m-0 shadow-none bg-primary-green/10 "> {/* Gradient background for more depth */}
  <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16 tracking-tight">Meet Our Team</h2> {/* Increased spacing and font weight */}
  <div className="flex flex-wrap gap-8 justify-center">
    <div className="w-full max-w-xs bg-white text-center rounded-xl p-8 transition-transform duration-300 hover:scale-105 hover:shadow-xl shadow-md relative group"> {/* Enhanced shadow on hover */}
      <div className="absolute inset-0 opacity-0 bg-primary-green/10 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div> {/* Subtle hover overlay */}
      <img src="../../src/assets/Vignesh Chandran.jpg" alt="Vicky" className="w-32 h-32 object-cover rounded-full mb-6 mx-auto border-4 border-primary-green transition-transform duration-300 group-hover:rotate-12" /> {/* Rotate effect on hover */}
      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-green transition-colors duration-300">Vignesh C</h3>
      <p className="text-gray-700 group-hover:text-primary-green transition-colors duration-300">Full-Stack Developer</p>
      <div className="absolute inset-x-0 bottom-4 text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Passionate about coding and problem-solving</div> {/* Added description on hover */}
    </div>
    <div className="w-full max-w-xs bg-white text-center rounded-xl p-8 transition-transform duration-300 hover:scale-105 hover:shadow-xl shadow-md relative group">
      <div className="absolute inset-0 opacity-0 bg-primary-green/10 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <img src="../../src/assets/portfolio.jpg" alt="Aki" className="w-32 h-32 object-cover rounded-full mb-6 mx-auto border-4 border-primary-green transition-transform duration-300 group-hover:rotate-12" />
      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-green transition-colors duration-300">Akilashwarran Prabaharan</h3>
      <p className="text-gray-700 group-hover:text-primary-green transition-colors duration-300">Full-Stack Developer</p>
      <div className="absolute inset-x-0 bottom-4 text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Creative thinker and developer</div>
    </div>
    <div className="w-full max-w-xs bg-white text-center rounded-xl p-8 transition-transform duration-300 hover:scale-105 hover:shadow-xl shadow-md relative group">
      <div className="absolute inset-0 opacity-0 bg-primary-green/10 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <img src="../../src/assets/Bharath Raj K.jpg" alt="Bharath" className="w-32 h-32 object-cover rounded-full mb-6 mx-auto border-4 border-primary-green transition-transform duration-300 group-hover:rotate-12" />
      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-green transition-colors duration-300">Bharath Raj</h3>
      <p className="text-gray-700 group-hover:text-primary-green transition-colors duration-300">Full-Stack Developer</p>
      <div className="absolute inset-x-0 bottom-4 text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Expert in modern web technologies</div>
    </div>
    <div className="w-full max-w-xs bg-white text-center rounded-xl p-8 transition-transform duration-300 hover:scale-105 hover:shadow-xl shadow-md relative group">
      <div className="absolute inset-0 opacity-0 bg-primary-green/10 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <img src="../../src/assets/Asha Kambarajan.png" alt="Asha" className="w-32 h-32 object-cover rounded-full mb-6 mx-auto border-4 border-primary-green transition-transform duration-300 group-hover:rotate-12" />
      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-green transition-colors duration-300">Asha K</h3>
      <p className="text-gray-700 group-hover:text-primary-green transition-colors duration-300">Full-Stack Developer</p>
      <div className="absolute inset-x-0 bottom-4 text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Innovative solutions specialist</div>
    </div>
    <div className="w-full max-w-xs bg-white text-center rounded-xl p-8 transition-transform duration-300 hover:scale-105 hover:shadow-xl shadow-md relative group">
      <div className="absolute inset-0 opacity-0 bg-primary-green/10 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <img src="../../src/assets/Vijayalakshmi Gandhi.jpg" alt="Viji" className="w-32 h-32 object-cover rounded-full mb-6 mx-auto border-4 border-primary-green transition-transform duration-300 group-hover:rotate-12" />
      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-green transition-colors duration-300">Vijayalakshmi Gandhi</h3>
      <p className="text-gray-700 group-hover:text-primary-green transition-colors duration-300">Full-Stack Developer</p>
      <div className="absolute inset-x-0 bottom-4 text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Focused on performance and scalability</div>
    </div>
  </div>
</section>


      <Footer />
    </div>
  );
};

export default HomePage;
