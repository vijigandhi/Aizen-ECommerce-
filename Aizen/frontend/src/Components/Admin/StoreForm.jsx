import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StoreForm = ({ onClose }) => {
  const [storeName, setStoreName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressLine3, setAddressLine3] = useState('');
  const [pincode, setPincode] = useState('');
  const [cityId, setCityId] = useState('');
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({ storeName: '', addressLine1: '', pincode: '', cityId: '' });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getCities.php');
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Failed to fetch cities');
      }
    };

    fetchCities();
  }, []);

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required.';
      isValid = false;
    }

    if (!addressLine1.trim()) {
      newErrors.addressLine1 = 'Address Line 1 is required.';
      isValid = false;
    }

    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required.';
      isValid = false;
    }

    if (!cityId) {
      newErrors.cityId = 'Please select a city.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    switch (field) {
      case 'storeName':
        setStoreName(value);
        if (errors.storeName) {
          setErrors((prevErrors) => ({ ...prevErrors, storeName: '' }));
        }
        break;
      case 'addressLine1':
        setAddressLine1(value);
        if (errors.addressLine1) {
          setErrors((prevErrors) => ({ ...prevErrors, addressLine1: '' }));
        }
        break;
      case 'addressLine2':
        setAddressLine2(value);
        break;
      case 'addressLine3':
        setAddressLine3(value);
        break;
      case 'pincode':
        setPincode(value);
        if (errors.pincode) {
          setErrors((prevErrors) => ({ ...prevErrors, pincode: '' }));
        }
        break;
      case 'cityId':
        setCityId(value);
        if (errors.cityId) {
          setErrors((prevErrors) => ({ ...prevErrors, cityId: '' }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const cityResponse = await fetch(`http://localhost:8000/controller/Admin/getCityDetails.php?city_id=${cityId}`);
      const cityData = await cityResponse.json();

      if (!cityData.state_id || !cityData.country_id) {
        toast.error('Failed to fetch city details');
        return;
      }

      const { state_id, country_id } = cityData;

      const response = await fetch('http://localhost:8000/controller/Admin/addStore.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: storeName,
          address_line1: addressLine1,
          address_line2: addressLine2,
          address_line3: addressLine3,
          pincode,
          city_id: cityId,
          state_id,
          country_id,
        }),
      });

      const text = await response.text();
      const result = JSON.parse(text);

      if (result.success) {
        toast.success('Store added successfully!');
        setStoreName('');
        setAddressLine1('');
        setAddressLine2('');
        setAddressLine3('');
        setPincode('');
        setCityId('');
        setErrors({});
        onClose();
      } else {
        toast.error('Failed to add store: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <form className="max-w-md mx-auto p-4 bg-white rounded" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Add New Store</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="storeName">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-sm ${errors.storeName ? '' : 'hidden'}`}>{errors.storeName}</p>
            </span>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="addressLine1">
              Address Line 1
            </label>
            <input
              type="text"
              id="addressLine1"
              value={addressLine1}
              onChange={(e) => handleChange('addressLine1', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-sm ${errors.addressLine1 ? '' : 'hidden'}`}>{errors.addressLine1}</p>
            </span>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="addressLine2">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLine2"
              value={addressLine2}
              onChange={(e) => handleChange('addressLine2', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="addressLine3">
              Address Line 3
            </label>
            <input
              type="text"
              id="addressLine3"
              value={addressLine3}
              onChange={(e) => handleChange('addressLine3', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="pincode">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-sm ${errors.pincode ? '' : 'hidden'}`}>{errors.pincode}</p>
            </span>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="city_id">
              Select City
            </label>
            <select
              id="city_id"
              value={cityId}
              onChange={(e) => handleChange('cityId', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a city</option>
              {Array.isArray(cities) &&
                cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
            </select>
            <span className="block h-6">
              <p className={`text-red-500 text-sm ${errors.cityId ? '' : 'hidden'}`}>{errors.cityId}</p>
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Store
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default StoreForm;



