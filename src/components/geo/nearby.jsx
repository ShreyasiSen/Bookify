import { useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaRulerCombined, FaStar } from 'react-icons/fa';

const HotelSearch = () => {
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedInfo, setSearchedInfo] = useState(null);
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
    setSearchedInfo(null);

    try {
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results && geocodeData.results.length > 0) {
        const { lat, lng } = geocodeData.results[0].geometry.location;
        const formattedAddress = geocodeData.results[0].formatted_address;

        try {
          const API_URL = 'https://bookify-v2-2.onrender.com';
          const response = await axios.get(`${API_URL}/api/hotels/nearby`, {
            params: {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              radius: parseFloat(distance)
            }
          });

          setHotels(response.data);
          setSearchedInfo({ address: formattedAddress, radius: distance });
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
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 py-10 text-white">
        <div className="absolute inset-0">
          <img
            src="https://media.istockphoto.com/id/1442849073/photo/the-earth-space-planet-3d-illustration-background-city-lights-on-planet.jpg?s=612x612&w=0&k=20&c=M4xlet0XFVCB4tLHgI3htTPNoemokpJxpmdUqpVBndU="
            alt="background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative w-full max-w-4xl bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-8 z-10">
          <h2 className="text-3xl font-bold text-center mb-2">🌍 Discover Nearby Hotels</h2>
          <p className="text-center text-gray-300 mb-6">
            Find hotels within a specific distance from your location.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city, landmark, or address"
                className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="relative w-full">
              <FaRulerCombined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Distance in kilometers"
                className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full md:w-40 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-md font-bold transition disabled:bg-gray-500"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && <p className="text-red-400 text-center mt-4">{error}</p>}

          {searchedInfo && (
            <p className="text-gray-300 text-center mt-6">
              Showing hotels within <strong>{searchedInfo.radius} km</strong> of{' '}
              <strong>{searchedInfo.address}</strong>
            </p>
          )}

          {hotels.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2">
              {hotels.map((hotel, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/hotels/${hotel._id}`)}
                  className="cursor-pointer bg-gray-900 bg-opacity-90 rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition duration-200"
                >
                  <img
                    src="https://source.unsplash.com/400x200/?hotel,room"
                    alt="hotel"
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-xl font-bold text-white">{hotel.name}</h3>
                  <p className="text-gray-400 text-sm mb-1">{hotel.address}</p>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-600'} />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">4.0</span>
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    Starting from <span className="font-semibold text-white">$120/night</span>
                  </div>
                  <p className="text-xs text-gray-500">Free WiFi · Pool · Parking</p>
                </div>
              ))}
            </div>
          )}

          {!loading && hotels.length === 0 && !error && searchedInfo && (
            <p className="text-center text-gray-400 mt-6">
              No hotels found within {searchedInfo.radius} km of {searchedInfo.address}.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default HotelSearch;