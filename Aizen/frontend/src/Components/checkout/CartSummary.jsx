import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartSummary = ({ onTotalChange, onUserIdChange }) => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to check authentication and get user ID
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
          setUserId(response.data.user.id);
          onUserIdChange(response.data.user.id); // Notify parent component with user ID
        } else {
          setError('User details are missing');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Error fetching user details');
      }
    } else {
      setError('Authorization token is missing');
    }
  };

  // Function to fetch cart items
  const fetchCartItems = async (userId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authorization token is missing');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/controller/getCartItem.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: { user_id: userId },
      });

      if (response.data && response.data.cartItems) {
        setItems(response.data.cartItems);
        onTotalChange(response.data.total);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch cart items');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Error fetching cart items');
      setItems([]);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);
    }
  }, [userId]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!cartItemId || newQuantity === undefined) {
      console.error('Missing parameters for updateQuantity');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/controller/cart.php',
        { cart_item_id: cartItemId, quantity: newQuantity, action: 'update_quantity' },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        fetchCartItems(userId);
      } else {
        console.error('Error updating cart item quantity:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error.response ? error.response.data : error.message);
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

  const handleQuantityChange = async (cartItemId, delta) => {
    if (isUpdating) return;

    const item = items.find(i => i.cart_item_id === cartItemId);
    if (!item) return;

    const newQuantity = Math.max(item.quantity + delta, 0);

    if (newQuantity !== item.quantity) {
      setIsUpdating(true);

      try {
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

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.selling_price);
      const quantity = parseInt(item.quantity, 10);
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  return (
    <div className="flex-1 bg-white shadow-md rounded-lg p-4 min-h-80 max-h-[calc(100vh-200px)]">
    <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
    {error && <p className="text-red-500">{error}</p>}
    {items.length > 0 ? (
      <ul className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
        {items.map(item => (
          <li key={item.cart_item_id} className="flex py-6 border-b border-gray-200">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={`http://localhost:8000/assets/images/${item.images}`}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
  
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <a href="#">{item.name}</a>
                  </h3>
                  <p className="ml-4">${item.selling_price}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {item.quantity} x ${item.selling_price}
                </p>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.cart_item_id, -1)}
                    className="px-3 py-0.5 border border-gray-300 rounded-l-md text-green-600 hover:bg-green-200 text-xl font-semibold"
                    disabled={item.quantity <= 0 || isUpdating}
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.cart_item_id, 1)}
                    className="px-3 py-0.5 border border-gray-300 rounded-r-md text-green-600 hover:bg-green-200 text-xl font-semibold"
                    disabled={isUpdating}
                  >
                    +
                  </button>
                </div>
  
                <div className="flex">
                  <button
                    type="button"
                    className="font-medium text-red-600 hover:text-red-500"
                    onClick={() => handleQuantityChange(item.cart_item_id, -item.quantity)}
                    disabled={isUpdating}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center">No items in cart.</p>
    )}
    <div className="mt-2 font-semibold text-lg">
      Total: ${calculateSubtotal()}
    </div>
  </div>
  

  );
};

export default CartSummary;
