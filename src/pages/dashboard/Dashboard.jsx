import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUserCircle, FaUpload, FaSave } from 'react-icons/fa';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const API_URL = 'https://bookify-v2-2.onrender.com';
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/users/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: token
          },
        }
      );
      toast.success("Profile updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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
        const API_URL = 'https://bookify-v2-2.onrender.com';
        const response = await axios({
          method: 'get',
          url: `${API_URL}/api/auth/profile`,
          headers: {
            Authorization: token
          },

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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#2c044c] to-black text-gray-100 font-sans">
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#1f0036]/80 backdrop-blur-md shadow-md border-b border-purple-800">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="pt-24 px-4 flex flex-col items-center min-h-[calc(100vh-80px)] space-y-10 pb-20">

        {/* Profile Summary Card */}
        <div className="w-full max-w-xl  p-6 flex flex-col items-center text-center ">
          {profilePicture ? (
            <img
              src={URL.createObjectURL(profilePicture)}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500 shadow-lg mb-2"
            />
          ) : profileData.img ? (
            <img
              src={profileData.img}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500 shadow-lg mb-4"
            />
          ) : (
            <FaUserCircle className="text-8xl text-purple-400 mb-4" />
          )}

          <label
            htmlFor="fileInput"
            className="mt-4 inline-flex items-center text-sm text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            <FaUpload className="mr-2" />
            Change Picture
          </label>
          <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
        </div>

        {/* Editable Profile Form */}
        <div className="w-full max-w-3xl bg-[#360057]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-700 space-y-6">
          <h2 className="text-2xl font-semibold text-purple-200 mb-4 border-b border-purple-600 pb-2">Edit Profile</h2>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="text-purple-400 block mb-1">Full Name</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#4b017b] text-white border border-purple-700 focus:ring-2 focus:ring-purple-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-purple-400 block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#4b017b] text-white border border-purple-700 focus:ring-2 focus:ring-purple-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-purple-400 block mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#4b017b] text-white border border-purple-700 focus:ring-2 focus:ring-purple-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-purple-400 block mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#4b017b] text-white border border-purple-700 focus:ring-2 focus:ring-purple-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-purple-400 block mb-1">ID Type</label>
              <select
                name="idType"
                value={profileData.idType}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#4b017b] text-white border border-purple-700 focus:ring-2 focus:ring-purple-400 outline-none transition"
              >
                <option value="">Select</option>
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="National ID">National ID</option>
              </select>
            </div>
            <div>
              <label className="text-purple-400 block mb-1">ID Number</label>
              <input
                type="text"
                name="idNumber"
                value={profileData.idNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#4b017b] text-white border border-purple-700 focus:ring-2 focus:ring-purple-400 outline-none transition"
              />
            </div>
          </form>

          <div className="mt-6 text-right">
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 transition text-white py-2 px-6 rounded-xl shadow-lg inline-flex items-center"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>

          </div>
        </div>
      </div>
      <ToastContainer />
    </div>


  );
};

export default ProfilePage;