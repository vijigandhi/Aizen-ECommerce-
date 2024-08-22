import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

let Modal = ({ isOpen, onClose }) => {
  let [requestDetails, setRequestDetails] = useState('');
  let [userId, setUserId] = useState(null);
  let [email, setEmail] = useState(''); // State for email ID
  let [error, setError] = useState('');
  let [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    let fetchUserId = async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          setError('Token not found. Please log in again.');
          return;
        }

        let response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          setUserId(response.data.user.id);
          setEmail(response.data.user.email); // Set email ID from response
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching user details:', err.response?.data || err.message);
        setError('Error fetching user details');
      }
    };

    if (isOpen) {
      fetchUserId();
    }
  }, [isOpen]);

  let validateForm = () => {
    if (requestDetails.trim() === '') {
      setError('Request details cannot be empty.');
      return false;
    }
    if (!userId) {
      setError('User ID is not available.');
      return false;
    }
    if (!email) {
      setError('Email ID is not available.');
      return false;
    }
    setError('');
    return true;
  };

  let handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      let token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token not found. Please log in again.');
        setLoading(false); // Reset loading state
        return;
      }

      let requestData = { details: requestDetails, user_id: userId, email: email };
      console.log('Sending request with:', requestData);

      let response = await axios.post('http://localhost:8000/controller/profile/vendorRequest.php', 
        requestData, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onClose(); // Close modal after successful request
      toast.success('Request submitted successfully');
    } catch (error) {
      console.error('Error submitting request:', error.response?.data || error.message);
      toast.error('Failed to submit the request. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${loading ? 'pointer-events-none' : ''}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative"> 
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 px-1 py-0.5 text-red-500 hover:bg-gray-100 text-xl font-semibold ${loading ? 'cursor-not-allowed' : ''}`}
          aria-label="Close"
          disabled={loading} // Optionally disable the button if loading
          >
            X
        </button>
        <h2 className="text-xl font-semibold mb-4">Vendor Information</h2>
        <p className="mb-1">Are you interested in promoting the vendor? <span className="text-red-500">*</span></p>
        <textarea 
          value={requestDetails}
          onChange={(e) => setRequestDetails(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your request details here..."
        />
        <div className="mb-5 h-2"> {/* Fixed height for error message container */}
          {error && <p className="text-red-500 text-2">{error}</p>} {/* Display error message if any */}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSubmit}
            disabled={loading} // Disable button while loading
            className={`px-2 py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-green'} text-white rounded-md flex items-center`}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-t-2 border-white border-opacity-50 rounded-full mr-2 spinner"></div>
            )}
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
      <ToastContainer />
      <style jsx>{`
        /* Spinner styles */
        .spinner {
          border: 2px solid #f3f3f3; /* Light grey */
          border-top: 2px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin-fast 0.5s linear infinite; /* Faster spin */
        }

        @keyframes spin-fast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Modal;