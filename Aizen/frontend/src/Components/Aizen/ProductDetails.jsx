import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';
import Footer from '../Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [subcategoryProducts, setSubcategoryProducts] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/controller/product.php?id=${id}`);
        if (response.data && !response.data.error) {
          setProduct(response.data);
          fetchSubcategoryProducts(response.data.subcategory_id);
        } else {
          setError(response.data.error || 'Product not found');
        }
      } catch (err) {
        setError('Error fetching product details');
        console.error('Error fetching product details:', err);
      }
    };

    const fetchSubcategoryProducts = async (subcategoryId) => {
      try {
        const response = await axios.get(`http://localhost:8000/controller/subcategory_products.php?subcategory_id=${subcategoryId}`);
        if (response.data && !response.data.error) {
          setSubcategoryProducts(response.data.filter(prod => prod.id !== parseInt(id)));
        } else {
          setSubcategoryProducts([]);
        }
      } catch (err) {
        setError('Error fetching subcategory products');
        console.error('Error fetching subcategory products:', err);
      }
    };

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.data && response.data.user) {
            setCustomerId(response.data.user.id);
            console.log(response.data.user.id);
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
        }
      }
    };

    fetchProduct();
    checkAuth();
  }, [id]);

  const handleClose = () => {
    navigate('/');
  };

  const handleAddToCart = async () => {
    if (!product || product.quantity === 0 ) {
      return;
    }
    if (!customerId) {
      toast.error('Please sign in to purchase products');
      navigate('/login'); 
      return;
    }

    const payload = {
      customer_id: customerId,
      product_id: product.id,
      quantity: quantity,
      price: product.selling_price,
      strikeout_price: product.actual_price,
    };
    console.log(payload);
    try {
      const response = await axios.post('http://localhost:8000/controller/cart.php', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data && response.data.success) {
        toast.success('Added to cart successfully!');
      } else {
        const errorMessage = response.data && response.data.message ? response.data.message : 'Unexpected error occurred';
        toast.error('Error adding to cart: ' + errorMessage);
      }
    } catch (error) {
      toast.error('Error adding to cart: ' + error.message);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center">Loading...</div>;
  }

  const imageUrl = product.images ? `http://localhost:8000/assets/images/${product.images}` : 'http://localhost:8000/assets/images/defaultImage.jpeg';

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
          style={{ fontSize: '46px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="sr-only">Close</span>
          &times;
        </button>

        <div className="flex gap-2 p-10">
          <div className="flex flex-col items-center w-full md:w-1/2 px-4 mb-8 relative">
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-80 h-80 rounded-lg mb-4"
                />
                {product.quantity === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold rounded-lg">
                    Out of Stock
                  </div>
                )}
              </div>
            ) : (
              <div>No image available</div>
            )}
          </div>

          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold text-orange-600">{product.name}</h2>
            <p className="text-gray-600 mt-4">{product.short_description}</p>
            <h5 className="text-lg text-gray-900 mt-4">
            <span className="line-through text-red-600 mr-2">₹{product.actual_price ? Number(product.actual_price).toFixed(2) : 'N/A'}</span>
              Price: ₹{product.selling_price ? Number(product.selling_price).toFixed(2) : 'N/A'}
            </h5>
            <p className="text-gray-700 mt-4">{product.description}</p>
            <p className="text-gray-700 mt-4">Quantity: {product.quantity}</p>
            <p className="text-gray-700 mt-4">Units: {product.unit}</p>

            <form className=" mt-6">
              <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Choose quantity:
              </label>
              <div className="relative flex items-center max-w-[8rem]">
  <button
    type="button"
    id="decrement-button"
    onClick={() => setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1))}
    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
  >
    <svg
      className="w-3 h-3 text-gray-900 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 2"
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
    </svg>
  </button>
  <input
    type="text"
    id="quantity-input"
    value={quantity}
    readOnly
    className="border-x-0 border-gray-300 h-11 text-center text-white text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <button
    type="button"
    id="increment-button"
    onClick={() => setQuantity(prevQuantity => Math.min(prevQuantity + 1, product.quantity))}
    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
  >
    <svg
      className="w-3 h-3 text-gray-900 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 18"
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
    </svg>
  </button>
</div>

              <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please select a quantity.
              </p>
            </form>
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className={`px-6 py-3 w-full sm:w-auto font-semibold rounded-lg shadow-md focus:outline-none transition duration-300 ease-in-out ${
                  product.quantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'
                }`}
              >
                Add to Cart
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>

      {subcategoryProducts.length > 0 && (
        <div className="bg-white py-12">
          <h2 className="text-2xl font-semibold mb-8 text-center">Other Products You May Like</h2>
          <div className="flex flex-wrap justify-center gap-6 px-6">
            {subcategoryProducts.map((prod) => (
              <div
              key={prod.id}
              className="relative flex flex-col max-w-xs p-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              {prod.discount > 0 && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                  {prod.discount}% Off
                </span>
              )}
              <img
                src={`http://localhost:8000/assets/images/${prod.images}`}
                alt={prod.name}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://localhost:8000/assets/images/defaultImage.jpeg';
                }}
              />
              {prod.quantity === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-bold rounded-lg">
                  Out of Stock
                </div>
              )}
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{prod.name}</h3>
                <p className="mt-2 text-gray-600">
                  {prod.description.length > 100 ? prod.description.slice(0, 70) + '...' : prod.description}
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <p className="text-gray-900 font-semibold">
                    ₹{prod.selling_price ? Number(prod.selling_price).toFixed(2) : 'N/A'}
                  </p>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      prod.quantity === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'
                    }`}
                    disabled={prod.quantity === 0}
                    onClick={() => navigate(`/product/${prod.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>            
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetails;
