import React, { useState, useEffect } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import CityForm from './CityForm';

const CitiesList = () => {
  const [cities, setCities] = useState([]);
  const [showCityForm, setShowCityForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getCities.php');
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const toggleCityForm = () => {
    setShowCityForm(!showCityForm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handleViewClick = (city) => {
    setSelectedCity(city);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCity(null);
  };

  // Filter and paginate the cities
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCities.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredCities.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div className='flex flex-col items-start'>
          <h2 className="text-3xl font-bold text-center text-green-900">City Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all cities efficiently</p>
        </div>
        <button
          onClick={toggleCityForm}
          className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <MdOutlineAddCircleOutline className="mr-2" /> Add New City
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
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
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

      {/* Cities List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">City ID</th>
              <th className="py-3 px-6 text-left">City Name</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {currentEntries.map((city) => (
              <tr key={city.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{city.id}</td>
                <td className="py-3 px-6">{city.name}</td>
                <td className="py-3 px-6 border-0 flex justify-center space-x-5">
                  <button
                    className="text-blue-500 border-0 hover:text-blue-700"
                    onClick={() => handleViewClick(city)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-500 border-0 hover:text-green-700"
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
          Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > filteredCities.length ? filteredCities.length : indexOfLastEntry} of {filteredCities.length} entries
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

      {/* City Form Modal */}
      {showCityForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <CityForm onClose={toggleCityForm} />
          </div>
        </div>
      )}

      {/* City Detail Modal */}
      {showDetailModal && selectedCity && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">City Details</h2>
            <p><strong>City ID:</strong> {selectedCity.id}</p>
            <p><strong>City Name:</strong> {selectedCity.name}</p>
            {/* Add more city details as needed */}
            <button
              onClick={closeDetailModal}
              className="mt-4 bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitiesList;
