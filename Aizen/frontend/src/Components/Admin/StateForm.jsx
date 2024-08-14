import React, { useState, useEffect } from 'react';

const StateForm = ({ onClose }) => {
  const [stateName, setStateName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getCountries.php'); // Adjust endpoint as necessary
        const data = await response.json();
        setCountries(data.countries); // Adjust according to your API response structure
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'stateName') {
      setStateName(e.target.value);
    } else {
      setCountryId(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/controller/Admin/addState.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: stateName, country_id: countryId }),
      });
      const result = await response.json();
      if (result.success) {
        alert('State added successfully!');
        setStateName('');
        setCountryId('');
        onClose(); // Close the form modal after successful submission
      } else {
        alert('Failed to add state');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">Add New State</h2>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <form className="max-w-md mx-auto p-4 bg-white  rounded" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stateName">
            State Name
          </label>
          <input
            type="text"
            id="stateName"
            name="stateName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stateName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="countryId">
            Country
          </label>
          <select
            id="countryId"
            name="countryId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={countryId}
            onChange={handleChange}
            required
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit" id='form-btn'
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add State
        </button>
      </form>
    </div>
  );
};

export default StateForm;
