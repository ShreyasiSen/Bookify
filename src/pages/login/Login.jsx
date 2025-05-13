import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const API_URL = 'https://bookify-v2-2.onrender.com';
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Left - Image */}
      <div className="w-full lg:w-1/2 relative h-64 lg:h-full">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className="bg-white p-2 rounded-full shadow">
              <span className="text-2xl font-bold text-blue-700">B</span>
            </div>
            <span className="text-white text-xl font-semibold">BookifyV2</span>
          </div>
         <div className="absolute bottom-4 left-4 text-white text-lg font-medium leading-tight">
         Book your dream vacation with us! 
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2 mb-4">
            Welcome to BookifyV2!
          </h2>
          <p className="text-center text-gray-500 mb-6">Login with Email</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <div className="flex items-center border rounded-md px-3">
                <span className="text-gray-400 mr-2">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-2 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="flex items-center border rounded-md px-3">
                <span className="text-gray-400 mr-2">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-2 focus:outline-none"
                  placeholder="********"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <div className="flex items-center justify-center my-4">
            <span className="w-full h-px bg-gray-300"></span>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <span className="w-full h-px bg-gray-300"></span>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 font-semibold">Register Now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
