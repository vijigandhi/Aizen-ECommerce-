import React, { useState, useEffect } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const Rejected = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getRejectedRequests.php');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredRequests = sortedRequests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.request_details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    }
    return null;
  };

  const indexOfFirstEntry = (currentPage - 1) * entriesPerPage + 1;
  const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredRequests.length);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Rejected Requests</h2> */}

      {/* Search Input and Entries Per Page Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <div className="flex items-center">
          <label htmlFor="entries" className="mr-2 text-gray-700">Show</label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded py-1 px-2 text-gray-700"
          >
            
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <label htmlFor="entries" className="ml-2 text-gray-700">entries</label>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Request ID {getSortIcon('id')}
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                User Name {getSortIcon('name')}
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('request_details')}
              >
                Details {getSortIcon('request_details')}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {paginatedRequests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{request.id}</td>
                <td className="py-3 px-6">{request.name}</td>
                <td className="py-3 px-6">{request.request_details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info and Navigation */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-700">
          Showing {indexOfFirstEntry} to {indexOfLastEntry} of {filteredRequests.length} entries
        </span>
        <div className="flex justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded  ${currentPage === index + 1 ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rejected;
