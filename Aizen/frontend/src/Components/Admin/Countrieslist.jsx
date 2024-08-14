import React, { useState, useEffect } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import CountryForm from './CountryForm';

const CountriesList = () => {
  const [countries, setCountries] = useState([]);
  const [showCountryForm, setShowCountryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(6);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getCountries.php');
        const data = await response.json();
        console.log('Fetched countries data:', data); // Log the fetched data
        setCountries(data.countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const toggleCountryForm = () => {
    setShowCountryForm(!showCountryForm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Filter and paginate the countries
  const filteredCountries = Array.isArray(countries) ? countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCountries.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredCountries.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div className='flex flex-col items-start'>
          <h2 className="text-3xl font-bold text-center text-green-900">Country Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all countries efficiently</p>
        </div>
        <button
          onClick={toggleCountryForm}
          className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <MdOutlineAddCircleOutline className="mr-2" /> Add New Country
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="entriesPerPage" className="mr-2">Show</label>
          <select
            id="entriesPerPage"
            className="border rounded py-1 px-2"
            value={entriesPerPage}
            onChange={handleEntriesChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
          <span className="ml-2">entries</span>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded py-1 px-3"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Countries List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Country ID</th>
              <th className="py-3 px-6 text-left">Country Name</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {currentEntries.map((country) => (
              <tr key={country.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{country.id}</td>
                <td className="py-3 px-6">{country.name}</td>
                <td className="py-3 px-6 border-0 flex justify-center space-x-5">
                  <button
                    className="text-blue-500 border-0 hover:text-blue-700"
                    // Add appropriate view/edit functionality here
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-500 border-0 hover:text-green-700"
                    // Add appropriate view/edit functionality here
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p>
          Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > filteredCountries.length ? filteredCountries.length : indexOfLastEntry} of {filteredCountries.length} entries
        </p>
        <div className="flex">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-green-900 text-white' : 'bg-white text-gray-800'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Country Form Modal */}
      {showCountryForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <CountryForm onClose={toggleCountryForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CountriesList;
