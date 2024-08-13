// CartSummary.jsx
import React, { useEffect, useState } from 'react';
import CartItem from '../cart/cartitem'; // Ensure the path is correct
import axios from 'axios';

const CartSummary = ({ cartItems }) => {

  const [userData, setUserData] = useState({});
  const [product, setProducts] = useState([]);
  const [error, setError] = useState(null);



  const calculateSubtotal = () => {
    return product.reduce((total, item) => {
      const price = Number(item.special_price); // Ensure price is a number
      const quantity = Number(item.quantity);   // Ensure quantity is a number
      return total + (price * quantity);
    }, 0).toFixed(2);

  };

  useEffect(() => {
    // Retrieve and parse user data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    setUserData(storedUserData);
    // Fetch cart items if user data is available
    if (storedUserData && storedUserData.id) {
      fetchCartItems(storedUserData.id);
    }
  }, []);

  useEffect(() => {
    const subtotal = calculateSubtotal();
    localStorage.setItem('total',JSON.stringify(subtotal));
  }, [product]); 


  const fetchCartItems = async (userId) => {
    
    try {
      const response = await axios.get('http://localhost:8000/controller/cart.php', {
        params: { id: userId },
      });

      if (response.data.error) {
        console.error('Error from server:', response.data.error);
        setError(response.data.error);
        setProducts([]);
      } 
      else if (Array.isArray(response.data)) {
        setProducts(response.data);
        setError(null);
      } 
      else {
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


  return (
    <div className="flex-1 bg-white shadow-md rounded-lg p-4 min-h-80 max-h-[calc(100vh-200px)]">
      <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
      {product.length > 0 ? (
        <ul className="space-y-2">
          {product.map((item, index) => (
            <CartItem
              key={index}
              product={item}
              userId={userData.id}
              fetchCartItems={fetchCartItems}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center">No items in cart.</p>
      )}
      <div className="mt-2 font-semibold text-lg">
        Total: ${calculateSubtotal()} {/* Call the function to compute the total */}
      </div>
    </div>
  );
};

export default CartSummary;
