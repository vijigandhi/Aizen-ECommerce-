import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Use trash icon for delete

const ViewCart = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.data.status === 'success') {
          const userId = response.data.user.id;
          setUserId(userId);
          fetchCartItems(userId);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching user details:', err.response?.data || err.message);
        setError('Error fetching user details');
      }
    };

    fetchUserId();
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8000/controller/cart.php', {
        params: { id: userId },
      });
  
      if (response.data.error) {
        setError(response.data.error);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
        setError(null);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      setError('Error fetching cart items');
    }
  };
  const handleContinueShopping = () => {
    navigate('/aizen/all-categories'); // Or wherever the user should go
  };
  

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!cartItemId || newQuantity === undefined) {
      console.error('Missing parameters for updateQuantity');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/controller/cart.php',
        {
          cart_item_id: cartItemId,
          quantity: newQuantity,
          action: 'update_quantity'
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        fetchCartItems(userId);
      } else {
        console.error('Error updating cart item quantity:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error.message);
    }
  };

  const deleteCartItem = async (cartItemId) => {
    if (!cartItemId) {
      console.error('Missing cartItemId for deleteCartItem');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:8000/controller/cart.php', {
        data: { cart_item_id: cartItemId },
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        fetchCartItems(userId);
      } else {
        console.error('Error deleting cart item:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting cart item:', error.message);
    }
  };

  const handleQuantityChange = async (cartItemId, delta, quantity) => {
    if (isUpdating) return;

    const newQuantity = Math.max(quantity + delta, 0);

    if (newQuantity !== quantity) {
      setIsUpdating(true);

      try {
        if (!userId) {
          console.error('User ID is not defined');
          return;
        }

        if (newQuantity === 0) {
          await deleteCartItem(cartItemId);
        } else {
          await updateQuantity(cartItemId, newQuantity);
        }

        await fetchCartItems(userId);
      } catch (error) {
        console.error('Error in handleQuantityChange:', error.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    const subtotal = products.reduce((total, product) => {
      const price = parseFloat(product.special_price) || 0;
      const quantity = parseInt(product.quantity, 10) || 0;
      return total + (price * quantity);
    }, 0);
    return subtotal.toFixed(2);
  };

  const calculateDelivery = () => {
    // Assuming delivery cost is fixed; adjust as needed
    return 0.00;
  };

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + calculateDelivery()).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header /> {/* Adding the Header component */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">My Shopping Cart</h3>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        {products.length === 0 ? (
          <p className="mt-6 text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-8"> {/* Add flex container */}
            <div className="lg:w-8/12"> {/* Adjust the width of the table container */}
              <table className="w-full bg-white shadow-md rounded-lg mt-6">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.cart_item_id} className="relative group hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <img
                            src={`http://localhost:8000/assets/images/${product.images}`}
                            alt={product.product_name}
                            className="w-16 h-16 object-cover mr-4 rounded"
                            onError={(e) => {
                              e.target.onerror = null; // Prevents infinite loop if error occurs
                              e.target.src = 'https://via.placeholder.com/64'; // Placeholder image
                            }}
                          />
                          <span>{product.product_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 x ₹{product.special_price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(product.cart_item_id, -1, product.quantity)}
                            className="px-3 py-0.5 border border-gray-400 rounded-l-md text-green-700 hover:bg-green-100 transition duration-200 ease-in-out"
                            disabled={product.quantity <= 0 || isUpdating}
                          >
                            <span className="text-xl font-semibold">-</span>
                          </button>
                          <span className="px-4 text-lg font-medium">{product.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product.cart_item_id, 1, product.quantity)}
                            className="px-3 py-0.5 border border-gray-400 rounded-r-md text-green-700 hover:bg-green-200 transition duration-200 ease-in-out"
                            disabled={isUpdating}
                          >
                            <span className="text-xl font-semibold">+</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{(parseFloat(product.special_price) * parseInt(product.quantity)).toFixed(2)}</td>
                      <button
                        onClick={() => deleteCartItem(product.cart_item_id)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-600 border border-red-600 rounded-full p-2 transition-opacity duration-200"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:w-4/12 mt-8 lg:mt-5"> {/* Adjust the width of the summary container */}
              <div className="relative bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h1> {/* Enhanced styling for "Order Summary" */}

                <div className="space-y-6">
                  {/* Subtotal */}
                  <div className="flex justify-between text-lg  text-gray-900">
                    <span>Subtotal:</span>
                    <span>₹{calculateSubtotal()}</span>
                  </div>
                  {/* Delivery */}
                  <div className="flex justify-between text-lg  text-gray-900">
                    <span>Delivery:</span>
                    <span>₹{calculateDelivery()}</span>
                  </div>
                  {/* Tax */}
                  <div className="flex justify-between text-lg  text-gray-900">
                    <span>Tax:</span>

                    <span>₹0</span>

                  </div>
                  {/* Discount */}
                  <div className="flex justify-between text-lg  text-gray-900">
                    <span>Discount:</span>

                    <span>₹0</span>

                  </div>
                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t-2 pt-4">
                    <span>Total:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
                
                {/* Buttons Section */}
                <div className="mt-6 flex justify-between">
                  {/* Continue Shopping Button */}
                  <button
                    onClick={handleContinueShopping}
                    className="px-6 py-3 bg-primary-green text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200 ease-in-out"
                  >
                    Continue Shopping
                  </button>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="px-6 py-3 bg-primary-green text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200 ease-in-out"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
  
  };

export default ViewCart;
