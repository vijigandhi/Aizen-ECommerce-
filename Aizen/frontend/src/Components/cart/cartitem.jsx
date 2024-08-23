import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartItem = ({ product, fetchCartItems, userId }) => {
  const [quantity, setQuantity] = useState(product.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setQuantity(product.quantity); // Sync quantity with product prop
  }, [product.quantity]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!cartItemId || newQuantity === undefined) {
      console.error('Missing parameters for updateQuantity');
      return;
    }

    try {
      console.log('Sending request to update quantity with params:', {
        cart_item_id: cartItemId,
        quantity: newQuantity,
        action: 'update_quantity'
      });

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

      console.log('Response from updateQuantity:', response.data);

      if (response.data.success) {
        console.log('Updated cart item quantity:', response.data.message);
        fetchCartItems(userId); // Refresh cart items
      } else {
        console.error('Error updating cart item quantity:', response.data.message);
        // Revert to previous quantity if update fails
        setQuantity(product.quantity);
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error.response ? error.response.data : error.message);
      // Revert to previous quantity if update fails
      setQuantity(product.quantity);
    }
  };

  const handleQuantityChange = async (delta) => {
    if (isUpdating) return; // Prevent multiple updates while updating

    const newQuantity = Math.max(quantity + delta, 0); // Ensure quantity is non-negative

    if (newQuantity !== quantity) {
      setQuantity(newQuantity);
      setIsUpdating(true);

      try {
        if (!userId) {
          console.error('User ID is not defined');
          return;
        }

        if (newQuantity === 0) {
          await deleteCartItem(product.cart_item_id);
        } else {
          await updateQuantity(product.cart_item_id, newQuantity); // Ensure parameters are correct
        }

        await fetchCartItems(userId);
      } catch (error) {
        console.error('Error in handleQuantityChange:', error.message);
        // Revert to previous quantity if error occurs
        setQuantity(product.quantity);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Function to handle deleting a cart item
  const deleteCartItem = async (cartItemId) => {
    if (!cartItemId) {
      console.error('Missing cartItemId for deleteCartItem');
      return;
    }

    try {
      console.log('Sending request to delete cart item with params:', { cart_item_id: cartItemId });

      const response = await axios.delete('http://localhost:8000/controller/cart.php', {
        data: { cart_item_id: cartItemId },
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Response from deleteCartItem:', response.data);

      if (response.data.success) {
        console.log('Deleted cart item:', response.data.message);
        fetchCartItems(userId); // Refresh cart items
      } else {
        console.error('Error deleting cart item:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting cart item:', error.message);
    }
  };

  // Calculate the total price for the current quantity
  const totalPrice = (Number(product.special_price) * quantity).toFixed(2);

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={`http://localhost:8000/assets/images/${product.images}`}
          alt={product.product_name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <a href="#">{product.product_name}</a>
            </h3>
            <p className="ml-4">
            ₹{totalPrice}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            1 x ₹{product.special_price}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-0.5 border border-gray-300 rounded-l-md text-green-600 hover:bg-green-200 text-xl font-semibold"
              disabled={quantity <= 0 || isUpdating}
            >
              -
            </button>
            <span className="px-3">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-0.5 border border-gray-300 rounded-r-md text-green-600 hover:bg-green-200 text-xl font-semibold"
              disabled={isUpdating}
            >
              +
            </button>
          </div>

          <div className="flex">
            <button
              type="button"
              className="font-medium text-green-600 hover:text-green-500"
              onClick={() => handleQuantityChange(-quantity)} // Remove item when clicking "Remove"
              disabled={isUpdating}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
