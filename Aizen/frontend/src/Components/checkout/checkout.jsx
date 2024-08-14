import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartSummary from './CartSummary'; // Ensure the path is correct
import Header from '../Header';

const Checkout = () => {

  
  const [formData, setFormData] = useState({
    shippingName: '',
    houseDetail: '',
    areaTown: '',
    zipcode: '',
    phoneNo: '',
    Country: 'India',
    stateSelect: 'Tamil Nadu',
    userId: null,
    total:0,
  //  paymentMethod: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cartItems, setCartItems] = useState([]);
   
  useEffect(() => {
    const fetchData = async () => {
      // Retrieve and parse data from localStorage
      const storedFormData = JSON.parse(localStorage.getItem('formData'));
      if (storedFormData) {
        setFormData(storedFormData);
      }
  
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
      if (storedCartItems) {
        setCartItems(storedCartItems);
      }
  
      const userData = JSON.parse(localStorage.getItem('userData'));
      const storedTotal = JSON.parse(localStorage.getItem('total')); // Retrieve total as string first
  
      // Parse total and ensure it's a number
      const total = storedTotal ? parseFloat(storedTotal) : 1;
  
      // Update formData if user data is available and total is non-zero
      if (userData && userData.id && total !== 0.00) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          userId: userData.id,
          total: total,
        }));
      }
    };
  
    fetchData();
  }, []);
  

  const handleChange = (e) => {

    localStorage.setItem('payment',true)
    
    const { name, value } = e.target;
    setFormData((prevState) => ({
      
      ...prevState,
      [name]: value,

    }));
  };

  const handleNextStep = () => {
    localStorage.setItem('formData', JSON.stringify(formData));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePlaceOrder = () => {
    setError('');
    if (localStorage.getItem('payment') == 'true') {
      axios.post('http://localhost:8000/controller/checkout.php', {
        ...formData,
      })
      .then((response) => {
        if (response.data.status === 'success') {
          setShowConfirmation(true);
          localStorage.removeItem('payment');
          localStorage.removeItem('formData');
          localStorage.removeItem('cartItems');
          
        } 
        else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setError('Failed to place order. Please try again.');
      });
    } else {

      setError('Sorry! This method is not working currently.');
    }
  };
  

  return (
    <div>
      <Header/>
       <div className="min-h-screen bg-gray-100 py-10 px-2 sm:px-3 lg:px-4">
      <div className="max-w-7xl mx-auto flex gap-4">
        {/* Shipping Information */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-4">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <form>
                <div className="mb-2">
                  <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700">
                    Shipping Name
                  </label>
                  <input
                    type="text"
                    name="shippingName"
                    id="shippingName"
                    value={formData.shippingName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500 sm:text-base"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="houseDetail" className="block text-sm font-medium text-gray-700">
                    House Details
                  </label>
                  <input
                    type="text"
                    name="houseDetail"
                    id="houseDetail"
                    value={formData.houseDetail}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500 sm:text-base"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="areaTown" className="block text-sm font-medium text-gray-700">
                    Area/Town
                  </label>
                  <input
                    type="text"
                    name="areaTown"
                    id="areaTown"
                    value={formData.areaTown}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500 sm:text-base"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                    Zipcode
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    id="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500 sm:text-base"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    id="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500 sm:text-base"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="Country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="Country"
                    id="Country"
                    value={formData.Country}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500 sm:text-base"
                    
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="stateSelect" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    name="stateSelect"
                    id="stateSelect"
                    value={formData.stateSelect}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    {/* Add other states if necessary */}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* Payment Method */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <div className="flex items-center mb-4">
                  <input type="radio" id="credit-card" name="paymentMethod" value="credit-card" className="mr-2" onChange={handleChange} />
                  <label htmlFor="credit-card" className="text-gray-500">Credit or Debit card (VISA)</label>
                  <img id="cardImage" src="/Assets/Cards.png" alt="" className="ml-4" />
                </div>
                <div className="flex items-center mb-4">
                  <input type="radio" id="net-banking" name="paymentMethod" value="net-banking" className="mr-2" onChange={handleChange} />
                  <label htmlFor="net-banking" className="text-gray-500">Net Banking</label>
                  <select className="ml-4 text-gray-500" defaultValue="">
                    <option value="" disabled>Select an option</option>
                    <option value="SBI">SBI</option>
                    <option value="HDFC">HDFC</option>
                  </select>
                </div>
                <div className="flex items-center mb-4">
                  <input type="radio" id="upi" name="paymentMethod" value="upi" className="mr-2" onChange={handleChange} />
                  <label htmlFor="upi" className="text-gray-500">Other UPI Apps</label>
                </div>
                <div className="flex items-center mb-4">
                  <input type="radio" id="cod" name="paymentMethod" value="cod" className="mr-2" onChange={handleChange } />
                  <label htmlFor="cod">Cash on delivery (COD) </label>
                   
                  
                  <p id="cod-info" className="text-sm text-gray-500 ml-2">Cash, UPI accepted</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Place Order
              </button>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          )}

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="mt-4 text-green-600">
              <h2 className="text-xl font-semibold mb-4">Order Placed Successfully!</h2>
              <p>Thank you for your purchase.</p>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <CartSummary cartItems={cartItems} />
      </div>
    </div>
    </div>
  );
};

export default Checkout;
