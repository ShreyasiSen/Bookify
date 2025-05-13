import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const HotelSearch = () => {
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!location) {
      setError('Please enter a location');
      return;
    }

    if (!distance || isNaN(distance) || distance <= 0) {
      setError('Please enter a valid distance');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results && geocodeData.results.length > 0) {
        const { lat, lng } = geocodeData.results[0].geometry.location;

        console.log(lat, lng, distance);

        try {
          const API_URL = 'https://bookify-v2-2.onrender.com';
          const response = await axios.get(`${API_URL}/api/hotels/nearby`, {
            params: {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              radius: parseFloat(distance)  // Convert distance to meters
            }
          });

          setHotels(response.data);
          console.log(response.data);
        } catch (err) {
          console.error('Error:', err);
          setError('Failed to fetch hotels');
        }
      } else {
        setError('Location not found. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen py-16 relative">
      {/* Floating Navbar */}

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Navbar />
        {/* You can add more navigation items here if needed */}
      </div>

      <div className="min-h-screen flex flex-col-reverse md:flex-row bg-gradient-to-br from-[#0f172a] to-[#3b0764] text-white font-sans relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')] opacity-10 z-0" />

        {/* Left Pane - Search Form */}
        <div className="relative z-10 w-full md:w-2/3 flex items-center justify-center p-6 md:p-12 lg:p-16">
          <div className="w-full max-w-lg bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-purple-300">
              🌌 Explore Stays Nearby
            </h2>

            <div className="space-y-6">
              {/* Location Input */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-300 mb-2">
                  📍 Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or region"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Distance Input */}
              <div>
                <label htmlFor="distance" className="block text-sm font-semibold text-gray-300 mb-2">
                  📏 Distance (km)
                </label>
                <input
                  type="number"
                  id="distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Search Button */}
              <div className="text-center pt-4">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold tracking-wide shadow-lg disabled:bg-gray-700"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c-3.14 0-6 1.86-8 5.36L4 12z" />
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    '🚀 Find Hotels'
                  )}
                </button>
              </div>

              {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

              {hotels.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-purple-200 mb-3">Results</h3>
                  <ul className="space-y-4">
                    {hotels.map((hotel, index) => (
                      <li key={index}>
                        <button
                          onClick={() => navigate(`/hotels/${hotel._id}`)}
                          className="w-full flex justify-between items-center px-4 py-3 rounded-md bg-white/10 hover:bg-white/15 border border-white/20 transition"
                        >
                          <div>
                            <h4 className="text-md font-bold text-white">{hotel.name}</h4>
                            <p className="text-sm text-gray-300">{hotel.address}</p>
                          </div>
                          <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hotels.length === 0 && !loading && !error && (
                <p className="mt-6 text-center text-gray-400">No hotels found. Try adjusting your search.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane - Visual Content */}
        <div className="relative z-10 w-full md:w-1/3 flex items-center justify-center bg-gradient-to-tl from-purple-900/30 via-indigo-800/20 to-purple-950/20 p-8">
          <div className="max-w-sm text-center space-y-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854866.png"
              alt="travel icon"
              className="w-24 mx-auto animate-bounce drop-shadow-md"
            />
            <h2 className="text-2xl md:text-3xl font-semibold text-purple-100">Ready to find your dream stay?</h2>
            <p className="text-sm text-gray-300 leading-relaxed">Search by location and distance to discover nearby hotels, resorts, and vacation rentals tailored just for you.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HotelSearch;