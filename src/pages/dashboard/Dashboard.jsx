import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUserCircle, FaUpload, FaSave } from 'react-icons/fa';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userId, setUserId] = useState('');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    img: '',
    address: '',
    idType: '',
    idNumber: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // Save the profile data including the profile picture
  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      // Append profile data fields
      formData.append('username', profileData.username);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      formData.append('address', profileData.address);
      formData.append('idType', profileData.idType);
      formData.append('idNumber', profileData.idNumber);
      
      // Append the profile picture if available
      if (profilePicture) {
        formData.append('img', profilePicture);
      }

      // Send PUT request with FormData
      const API_URL='https://bookify-v2-2.onrender.com';
      const token=localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/users/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: token },
        }
      );

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to update profile');
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL='https://bookify-v2-2.onrender.com';
        const response = await axios({
          method: 'get',
          url: `${API_URL}/api/auth/profile`,
          headers: {
            Authorization: token },
        
        });
        setUserId(response.data._id);
        setProfileData(response.data);
        console.log(response.data.img);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch profile');
        if (err.response?.status === 401) {
          navigate('/login');
        }
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Update Profile</h1>

          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt='preview'
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : profileData.img ? (
              <img
                src={profileData.img}
                alt='profile'
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-6xl text-gray-500" />
            )}
          </div>
          <div className="text-center mb-6">
            <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-indigo-600 font-semibold hover:underline flex items-center justify-center"
            >
              <FaUpload className="mr-2" />
              Upload Profile Picture
            </label>
          </div>

        
          <form className="space-y-4">
            <div>
              <label className="block font-medium">Full Name</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">ID Type</label>
                <select
                  name="idType"
                  value={profileData.idType}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="Passport">Passport</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="National ID">National ID</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={profileData.idNumber}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              <FaSave className="inline mr-2" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;