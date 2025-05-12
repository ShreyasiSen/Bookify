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
          const API_URL='https://bookify-v2-2.onrender.com';
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
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 h-screen flex justify-center items-center">
        <div className="max-w-lg w-full mt-10 p-6 bg-white shadow-lg rounded-lg space-y-4">
          <h2 className="text-3xl font-semibold text-center text-gray-800">Search for Nearby Hotels</h2>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location (e.g., New York, USA)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter distance in km"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="ml-48 w-20 py-2 bg-purple-600 text-white rounded-md font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {hotels.length > 0 ? (
            <div className="space-y-4">
              {hotels.map((hotel, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm" 
                  onClick={() => navigate(`/hotels/${hotel._id}`)}>
                  <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
                  <p className="text-gray-600">{hotel.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-100">No hotels found in your area.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HotelSearch;