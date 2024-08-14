import React, { useState, useEffect } from 'react';

const CityForm = ({ onClose }) => {
  const [cityName, setCityName] = useState('');
  const [stateId, setStateId] = useState('');
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getStates.php');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
  }, []);

  const handleChange = (e) => {
    setCityName(e.target.value);
  };

  const handleStateChange = (e) => {
    setStateId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/controller/Admin/addCity.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: cityName, state_id: stateId }),
      });
      const result = await response.json();
      if (result.success) {
        alert('City added successfully!');
        setCityName(''); // Clear the input field
        setStateId(''); // Clear the state selection
        onClose(); 
      } else {
        alert('Failed to add city: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    
    <div className="relative">
    <h2 className="text-xl font-bold mb-4">Add New City</h2>
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          City Name
        </label>
        <input
          type="text"
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={cityName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
          Select State
        </label>
        <select
          id="state"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={stateId}
          onChange={handleStateChange}
          required
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit" id='form-btn'
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add City
      </button>
    </form>
    </div>
    
  );
};

export default CityForm;
