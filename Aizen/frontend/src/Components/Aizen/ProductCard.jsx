import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
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
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
        }
      }
    };

    checkAuth();
  }, []);

  const addToCart = async (event) => {
    event.stopPropagation();

    if (product.quantity <= 0) {
      toast.error('Cannot add to cart. Product is out of stock.');
      return;
    }

    if (!customerId) {
      toast.error('User not Loged in. Redirecting to login page.');
      navigate('/login'); 
      return;
    }

    const payload = {
      customer_id: customerId,
      product_id: product.id,
      quantity: 1,
      price: product.selling_price,
      strikeout_price: product.actual_price || product.selling_price
    };

    try {
      const response = await axios.post('http://localhost:8000/controller/cart.php', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        toast.success('Added to cart successfully!');
      } else {
        toast.error(`Error adding to cart: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error adding to cart: ${error.message}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const sellingPrice = parseFloat(product.selling_price);
  const actualPrice = parseFloat(product.actual_price);
  const discountPercentage = actualPrice ? Math.round(((actualPrice - sellingPrice) / actualPrice) * 100) : 0;
  const formattedPrice = isNaN(sellingPrice) ? '0.00' : sellingPrice.toFixed(2);

  return (
    <div
      className="relative flex flex-col max-w-xs w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg pb-14 transform transition duration-300 hover:scale-105 hover:border-green-500"
      onClick={handleViewDetails}
      style={{ maxWidth: "235px", margin: '10px' }}
    >
      <div className="relative flex-grow overflow-hidden">
        <div className="relative mx-2 mt-2 flex h-40 overflow-hidden rounded-lg">
          <img
            className="object-cover w-full h-full"
            src={`http://localhost:8000/assets/images/${product.images}`}
            alt={product.name}
            style={{ objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'http://localhost:8000/assets/images/placeholder.jpg'; }}
          />
          {product.quantity <= 0 && (
            <span className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs font-bold">
              Out of Stock
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 rounded-full bg-black px-2 text-center text-xs font-medium text-white">
              {`${discountPercentage}% Discount`}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center mt-2 px-2">
          <h5 className="text-sm font-semibold text-slate-900 text-center overflow-hidden max-h-12 leading-tight line-clamp-2">
            {product.name}
          </h5>
          <p className="mt-1 mb-2 text-center">
            <span className="text-sm font-bold text-orange-600">${formattedPrice}</span>
            {product.actual_price && (
              <span className="text-xs font-normal text-gray-500 line-through ml-1">
                ${product.actual_price}
              </span>
            )}
          </p>
        </div>
      </div>
      <button
        onClick={addToCart}
        disabled={product.quantity <= 0}
        className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-9/12 px-4 py-2 text-center text-xs font-medium shadow-sm rounded-lg transition duration-300 ease-in-out ${
          product.quantity <= 0
            ? 'bg-gray-500 cursor-not-allowed text-white'
            : 'bg-green-700 text-white hover:bg-green-800 focus:ring-green-300'
        }`}
      >
        {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
