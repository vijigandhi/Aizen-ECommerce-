import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartSummary from './CartSummary';
import Header from '../Header';
import Swal from 'sweetalert2';

const Checkout = () => {
  const [formData, setFormData] = useState({
    shippingName: '',
    houseDetail: '',
    zipcode: '',
    phoneNo: '',
    Country: '',
    stateSelect: '',
    city: '',
    userId: null,
    total: 0,
    paymentMethod: '',
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/Admin/getCountries.php');
        setCountries(response.data.countries || []);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.Country) {
      const fetchStatesForCountry = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/controller/state.php?country=${formData.Country}`);
          setStates(response.data || []);
          setCities([]);
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      };

      fetchStatesForCountry();
    }
  }, [formData.Country]);

  useEffect(() => {
    if (formData.stateSelect) {
      const fetchCitiesForState = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/controller/city.php?state=${formData.stateSelect}`);
          setCities(response.data || []);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };

      fetchCitiesForState();
    }
  }, [formData.stateSelect]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = formData.userId || localStorage.getItem('userId');
        if (userId) {
          const response = await axios.get('http://localhost:8000/controller/getCartItem.php', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            params: { user_id: userId },
          });
          setCartItems(response.data.cartItems || []);
          setFormData(prev => ({ ...prev, total: response.data.total }));
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items');
      }
    };

    fetchCartItems();
  }, [formData.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      localStorage.setItem('formData', JSON.stringify(updatedFormData));
      return updatedFormData;
    });
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true); // Set loading to true

    if (!formData.paymentMethod) {
      setError('Please select a payment method.');
      setLoading(false); // Set loading to false
      return;
    }

    try {
      console.log('Placing order with data:', formData);

      const response = await axios.post('http://localhost:8000/controller/checkout.php', {
        ...formData,
        cartItems,
      });

      console.log('Checkout API Response:', response.data);

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Order Confirmed!',
          text: 'Thank you for your purchase. Redirecting to home...',
          timer: 2000,
          showConfirmButton: false,
        });

        // Update cart quantities
        try {
          const updateResponse = await axios.post('http://localhost:8000/controller/updatequantity.php', {
            userId: formData.userId,
            items: cartItems.map(item => ({
              cart_item_id: item.cart_item_id,
              quantity: item.quantity,
            })),
          });

          console.log('Update Response:', updateResponse.data);

          if (updateResponse.data.success) {
            localStorage.removeItem('payment');
            localStorage.removeItem('formData');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('total');

            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else {
            setError(updateResponse.data.error || 'Failed to update quantities. Please try again.');
          }
        } catch (updateError) {
          console.error('Update failed:', updateError);
          setError('An error occurred while updating quantities. Please try again.');
        }
      } else {
        setError(response.data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleTotalChange = (total) => {
    setFormData((prev) => ({ ...prev, total: parseFloat(total) }));
  };

  const handleUserIdChange = (userId) => {
    setFormData((prev) => ({ ...prev, userId }));
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 py-10 px-2 sm:px-3 lg:px-4">
        <div className="max-w-7xl mx-auto flex gap-4">
          <div className="flex-1 bg-white shadow-md rounded-lg p-4">
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="text-white text-xl">Loading...</div>
              </div>
            )}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <form>
                  <label className="block mb-2">
                    Full Name:
                    <input
                      type="text"
                      name="shippingName"
                      value={formData.shippingName}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </label>
                  <label className="block mb-2">
                    House Detail:
                    <input
                      type="text"
                      name="houseDetail"
                      value={formData.houseDetail}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </label>
                  <label className="block mb-2">
                    Zipcode:
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </label>
                  <label className="block mb-2">
                    Phone Number:
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </label>
                  <label className="block mb-2">
                    Country:
                    <select
                      name="Country"
                      value={formData.Country}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block mb-2">
                    State:
                    <select
                      name="stateSelect"
                      value={formData.stateSelect}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block mb-2">
                    City:
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-primary-green text-white py-2 px-4 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <form>
                  <label className="block mb-2">Payment Method:</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="mr-2"
                        required
                      />
                      Cash on Delivery
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      UPI
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Credit Card
                    </label>
                  </div>
        
                  {/* Conditional rendering to show future feature message */}
                  {(formData.paymentMethod === 'upi' || formData.paymentMethod === 'credit_card') && (
                    <p className="mt-2 text-red-600">This payment option currently not available. Please choose cash on delivery</p>
                  )}
        
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md"
                      disabled={formData.paymentMethod !== 'cod'}
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="w-1/3">
            <CartSummary onTotalChange={handleTotalChange} onUserIdChange={handleUserIdChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
