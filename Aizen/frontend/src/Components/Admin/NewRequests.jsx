import React, { useState, useEffect } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const NewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(5);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getRequests.php');
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

  const filteredRequests = sortedRequests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRequestsPerPageChange = (event) => {
    setRequestsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRequests.length / requestsPerPage); i++) {
    pageNumbers.push(i);
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    }
    return null;
  };

  const handleViewClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const handleApprove = async () => {
    try {
      const response = await fetch('http://localhost:8000/controller/Admin/managerequests.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'approve',
          requestId: selectedRequest.id
        })
      });
      const result = await response.json();
      if (result.status === 'success') {
        // Refresh request list or update state
        setRequests(prevRequests => 
          prevRequests.map(req =>
            req.id === selectedRequest.id ? { ...req, status: 1 } : req
          )
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    handleCloseModal();
  };

  const handleReject = async () => {
    try {
      const response = await fetch('http://localhost:8000/controller/Admin/managerequests.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'reject',
          requestId: selectedRequest.id
        })
      });
      const result = await response.json();
      if (result.status === 'success') {
        // Refresh request list or update state
        setRequests(prevRequests => 
          prevRequests.map(req =>
            req.id === selectedRequest.id ? { ...req, status: 2 } : req
          )
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    handleCloseModal();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="entries" className="mr-2 text-gray-700">Show</label>
          <select
            id="entries"
            value={requestsPerPage}
            onChange={handleRequestsPerPageChange}
            className="border border-gray-300 rounded py-1 px-2 text-gray-700"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <label htmlFor="entries" className="ml-2 text-gray-700">entries</label>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No new requests found</p>
      ) : (
        <>
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
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {currentRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                    <td className="py-3 px-6">{request.id}</td>
                    <td className="py-3 px-6">{request.name}</td>
                    <td className="py-3 px-6">{request.request_details}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition duration-300"
                        onClick={() => handleViewClick(request)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {indexOfFirstRequest + 1} to {indexOfLastRequest > filteredRequests.length ? filteredRequests.length : indexOfLastRequest} of {filteredRequests.length} entries
            </div>
            <div className="flex space-x-1">
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded ${currentPage === number ? 'bg-primary-green text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">Request's Detail</h3>
            <p>
              <strong>Name:</strong> {selectedRequest.name}
            </p>
            <p>
              <strong>Request Detail:</strong> {selectedRequest.request_details}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(selectedRequest.created_at).toLocaleDateString()}
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                onClick={handleReject}
              >
                Reject
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRequests;



