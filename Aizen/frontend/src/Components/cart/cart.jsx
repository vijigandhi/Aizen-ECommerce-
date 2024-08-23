import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartItem from './cartitem'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [userId, setUserId] = useState(null);

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
          // setError(response.data.message);
          setError('Login to add Your cart');
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
        console.error('Error from server:', response.data.error);
        setError(response.data.error);
        setProducts([]);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
        setError(null);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected response format');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err.response?.data || err.message);
      setError('Error fetching cart items');
      setProducts([]);
    }
  };



  const calculateSubtotal = () => {
    const subtotal = products.reduce((total, product) => {
      const price = parseFloat(product.special_price) || 0;
      const quantity = parseInt(product.quantity, 10) || 0;
      return total + (price * quantity);
    }, 0);
    return subtotal.toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout');
    setIsOpen(false);
  };

  const handleClose = () => {
    navigate('/home');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed z-50'>
      <div className="fixed inset-0 z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <div className="fixed inset-0">
          <div className="absolute inset-0">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <button
                        type="button"
                        className="text-green-600 font-medium hover:text-green-700"
                        onClick={() => navigate('/viewcart')} // Navigate to cart page
                      >
                        View Cart
                      </button>
                      <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping Cart</h2>
                      <div className="ml-3 flex h-7 items-center">
                        <button type="button" className="rounded-md text-gray-400 hover:text-gray-500" onClick={handleClose}>
                          <span className="sr-only">Close panel</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div> <br></br>
                    {error && <div className="text-red-600">{error}</div>}
                    {products.length === 0 ? (
                      <p className="mt-6 text-center text-gray-500">Your cart is empty.</p>
                    ) : (
                      <ul role="list" className="divide-y divide-gray-200">
                        {products.map((product) => (
                          <CartItem key={product.cart_item_id} product={product} fetchCartItems={fetchCartItems} userId={userId} />
                        ))}
                      </ul>
                    )}
                  </div>
                  {products.length > 0 && (
                    <div className="border-t border-gray-200">
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>₹{calculateSubtotal()}</p>
                        </div>
                        <div className="mt-6">
                          <button
                            type="button"
                            className="w-full rounded-md border border-transparent bg-green-600 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700"
                            onClick={handleCheckout}
                          >
                            Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;