import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import Modal from './vendorpopup'; // Ensure this path is correct
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({ setProfileOpen }) => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/150');
  const [avatarFile, setAvatarFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch user ID and role ID
  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token not found. Please log in again.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          const { id, role_id } = response.data.user;
          setUserId(id);
          setProfile(response.data.user);
          setFormData(response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching user details:', err.response?.data || err.message);
        setError('Error fetching user details');
      }
    };

    fetchUserId();
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/controller/profile/read_profile.php', {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: userId }
        });

        setProfile(response.data);
        setFormData(response.data);
        setImageUrl(response.data.avatar || 'https://via.placeholder.com/150');
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, [userId]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Username is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!/^\d+$/.test(formData.mobile_no)) errors.mobile_no = 'Mobile number must be numeric';
    if (!formData.mobile_no) errors.mobile_no = 'Mobile number is required';
    if (!formData.address_line1) errors.address_line1 = 'Address Line 1 is required';
    if (!formData.address_line2) errors.address_line2 = 'Address Line 2 is required';
    if (!formData.address_line3) errors.address_line3 = 'Address Line 3 is required';

    // Address line 2 and 3 are not required, so no validation for these fields
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      toast.error('Authentication token is missing. Please log in again.');
      return;
    }

    const updatedFormData = { ...formData, user_id: userId };

    try {
      console.log('Saving formData:', updatedFormData); // Log formData before saving

      // Send profile update request
      const response = await axios.post(
        'http://localhost:8000/controller/profile/update_profile.php',
        updatedFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Profile save response:', response.data);
      setProfile(updatedFormData);

      if (avatarFile) {
        const formDataForUpload = new FormData();
        formDataForUpload.append('avatar', avatarFile);
        formDataForUpload.append('user_id', userId); // Ensure user_id is added

        // Send avatar upload request
        const uploadResponse = await axios.post(
          'http://localhost:8000/controller/profile/upload_avatar.php',
          formDataForUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('Avatar upload response:', uploadResponse.data);
      }

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      // Improved error handling
      console.error('Error saving profile:', error.response?.data || error.message);
      // toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      <section className="p-6 max-w-4xl mx-auto">
        <div className={`bg-white shadow-lg rounded-lg p-6 ${isEditing ? 'mt-0' : 'mt-24'}`}>
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-6 cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
              <img src={imageUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          <div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                      {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                      {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="mobile_no"
                        value={formData.mobile_no || ''}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        pattern="\d*"
                        inputMode="numeric"
                      />
                      {validationErrors.mobile_no && <p className="text-red-500 text-sm">{validationErrors.mobile_no}</p>}
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.mobile_no}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1 || ''}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                      {validationErrors.address_line1 && <p className="text-red-500 text-sm">{validationErrors.address_line1}</p>}
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.address_line1}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 2 <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2 || ''}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                      {validationErrors.address_line2 && <p className="text-red-500 text-sm">{validationErrors.address_line2}</p>}
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.address_line2}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 3 <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="address_line3"
                        value={formData.address_line3 || ''}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                      {validationErrors.address_line3 && <p className="text-red-500 text-sm">{validationErrors.address_line3}</p>}
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.address_line3}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveClick}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </form>
          </div>
          </div><br />
        <p>
          Interested in becoming a{' '}
          <a
            href="#"
            onClick={() => setIsModalOpen(true)} // Ensure this function is working
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Vendor ?
          </a>
      </p>
    {isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}

        {/* </div> */}
      </section>
      <ToastContainer />
      
    </>
  );
};

export default Profile;
