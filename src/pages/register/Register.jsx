import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    const { username, email, password } = formData
    setError('') // Clear previous errors

    // Basic input validation
    if (!username || !email || !password) {
      setError('All fields are required!')
      return
    }

    setLoading(true)
    const API_URL='https://bookify-v2-2.onrender.com';
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, email, password })
      navigate('/login') // Redirect to login page on success
    } catch (err) {
      // Handle different error scenarios
      if (err.response) {
        // If the error is due to a response from the server
        setError(`Error: ${err.response.data.message || 'An error occurred'}`)
      } else if (err.request) {
        // If the error is due to a request not being sent
        setError('Network error. Please try again later.')
      } else {
        // General error handling
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-600 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300"
              placeholder="Enter your username"
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
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300"
              placeholder="Enter your email"
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
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300"
              placeholder="Create a password"
            />
          </div>

          {/* Display error message if any */}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account? <a href="/login" className="text-indigo-600 font-semibold">Login here</a></p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
