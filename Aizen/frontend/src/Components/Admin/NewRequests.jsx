import React, { useState, useEffect } from 'react';

const NewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  const handleViewClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const handleApprove = () => {
    console.log('Approved:', selectedRequest.id);
    handleCloseModal();
  };

  const handleReject = () => {
    console.log('Rejected:', selectedRequest.id);
    handleCloseModal();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">New Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Request ID</th>
              <th className="py-3 px-6 text-left">User Name</th>
              <th className="py-3 px-6 text-left">Details</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {requests.map((request) => (
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
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                onClick={handleReject}
              >
                Reject
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-300"
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

