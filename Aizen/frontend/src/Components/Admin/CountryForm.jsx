import React, { useState } from 'react';

const CountryForm = () => {
  const [countryName, setCountryName] = useState('');

  const handleChange = (e) => {
    setCountryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert('Country added successfully!');
        setCountryName(''); // Clear the input field
      } else {
        alert('Failed to add country');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
     <h2 className="text-xl font-bold mb-4">Add New Country</h2>
       <form className="max-w-md mx-auto p-4 bg-white shadow-md rounded" onSubmit={handleSubmit}>
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
          required
        />
      </div>
      <button
        type="submit" id='form-btn'
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Country
      </button>
    </form>
    </>
  );
};

export default CountryForm;
