import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    setError('');

    if (!username || !email || !password) {
      setError('All fields are required!');
      return;
    }

    setLoading(true);
    const API_URL = 'https://bookify-v2-2.onrender.com';

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      navigate('/login');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred');
      } else if (err.request) {
        setError('Network error. Please try again later.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full font-sans">
      {/* Left section */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-auto">
        <img
          src="/Register.jpg"
          alt="Home"
          className="object-cover w-full h-full"
        />
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full shadow">
            <span className="text-2xl font-bold text-cyan-700">B</span>
          </div>
          <span className="text-white text-xl font-semibold">BookifyV2</span>
        </div>
        <div className="absolute bottom-4 left-4 text-white text-lg font-medium leading-tight">
          Away from Home,<br /> Yet Feels Like Home
        </div>
      </div>

      {/* Right section */}
      <div className="w-full bg-white  lg:w-1/2 px-6 py-10 sm:px-10 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="User"
              className="w-16 h-16 mx-auto mb-2"
            />
            <h2 className="text-2xl font-semibold text-gray-700">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-600 font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Error message */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-3 rounded-md font-semibold hover:bg-cyan-700 transition"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
           <div className="flex items-center justify-center my-4">
            <span className="w-full h-px bg-gray-300"></span>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <span className="w-full h-px bg-gray-300"></span>
          </div>


          {/* Login redirect */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-cyan-600 font-semibold hover:underline">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
