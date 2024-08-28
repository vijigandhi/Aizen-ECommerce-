import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CountryForm = ({ onClose }) => {
  const [countryName, setCountryName] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCountryName(e.target.value);
    if (error) {
      setError(''); // Clear the error when the user starts typing
    }
  };

  const validateField = () => {
    if (!countryName.trim()) {
      setError('Country name is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateField()) return;

    try {
      const response = await fetch('http://localhost:8000/controller/Admin/addCountry.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: countryName }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Country added successfully!');
        setCountryName(''); // Clear the input field
        onClose(); // Close the form
      } else {
        toast.error('Failed to add country: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while adding the country.');
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">Add New Country</h2>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <form className="max-w-md mx-auto p-4 bg-white rounded" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Country Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={countryName}
            onChange={handleChange}
          />
          <span className="block h-6">
            <p className={`text-red-500 text-sm ${error ? '' : 'hidden'}`}>{error}</p>
          </span>
        </div>
        <button
          type="submit"
          id="form-btn"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Country
        </button>
      </form>
      {/* Add the ToastContainer component to the component tree */}
      <ToastContainer />
    </div>
  );
};

export default CountryForm;

