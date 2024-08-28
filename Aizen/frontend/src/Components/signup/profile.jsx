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
  const [imageUrl, setImageUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(''); // Add state for email
  const [roleId, setRoleId] = useState(null); // Add state for role_id
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
          setUserId(response.data.user.id);
          setEmail(response.data.user.email); // Set email from response
          setRoleId(response.data.user.role_id); // Set role_id from response
          console.log("profile role:",response.data.user);
          
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
        setImageUrl(response.data.avatar);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, [userId]);

  const validateForm = () => {
    const errors = {};

    // Validate that the mobile number is numeric
    if (!/^\d+$/.test(formData.mobile_no)) {
      errors.mobile_no = 'Mobile number must be numeric';
    }

    // Validate that the mobile number is exactly 10 digits long
    if (formData.mobile_no.length !== 10) {
      errors.mobile_no = 'Mobile number must be exactly 10 digits';
    }

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
      <div className={` max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 ${isEditing ? 'mt-12' : 'mt-12'}`}>
        <div className="flex items-center mb-6">
          <div
            className="w-24 h-24 rounded-full overflow-hidden mr-6 cursor-pointer"
            onClick={() => {
              if (isEditing) {
                document.getElementById('fileInput').click();
              } 
            }}
          >
            <img src={imageUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            {/* <p className="text-gray-600 mt-2">{email}</p> Display email */}
            <p className="text-gray-600 mt-2">{profile.email}</p> {/* Display role_id */}
          </div>
        </div>
        <div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900">
                  Username 
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
                  </>
                ) : (
                  <p className="mt-1 text-gray-900">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Email
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
                  </>
                ) : (
                  <p className="mt-1 text-gray-900">{profile.email}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Mobile 
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="mobile_no"
                      value={formData.mobile_no || ''}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                    {validationErrors.mobile_no && (
                      <p className="text-red-500 text-sm">{validationErrors.mobile_no}</p>
                    )}
                  </>
                ) : (
                  <p className="mt-1 text-gray-900">{profile.mobile_no}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Address 1
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="address_line_1"
                      value={formData.address_line_1 || ''}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </>
                ) : (
                  <p className="mt-1 text-gray-900">{profile.address_line_1}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Address 2
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address_line_2"
                    value={formData.address_line_2 || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profile.address_line_2}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Address 3
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address_line_3"
                    value={formData.address_line_3 || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profile.address_line_3}</p>
                )}
              </div>
            </div>
          </form>
          {isEditing ? (
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handleSaveClick}
                className="bg-primary-green text-white py-2 px-4 rounded-md shadow hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="bg-gray-500 text-white py-2 px-4 rounded-md shadow hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleEditClick}
                className="bg-yellow-500 text-white py-2 px-4 font-bold rounded-md shadow hover:bg-yellow-600"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      {/* </div> */}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
        {roleId === 3 && (
   
   <p>
        Interested in becoming a{' '}
          <a
            href="#"
            onClick={() => setIsModalOpen(true)}
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Vendor ?
          </a>
      </p>
        )}

      {isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      <ToastContainer />
          </div><br />
        
      
    </>
  );
};

export default Profile;
