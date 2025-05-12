import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import { FaArrowRight } from 'react-icons/fa';

const Hotel = () => {
  const url = new URL(window.location.href);
  const hotelId = url.pathname.split('/').pop();

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelData, setHotelData] = useState([]);
  const API_URL = 'https://bookify-v2-2.onrender.com';
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hotels/${hotelId}`);
        setHotelData(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [hotelId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("INSIDE TRY BLOCK");
        const response = await axios.get(`${API_URL}/api/hotels/rooms/${hotelId}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [hotelId]);

  if (loading) return <div className="text-center mt-20 text-xl text-white">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-xl text-red-500">Error loading data</div>;
  
  const darkBg = "bg-gradient-to-br from-gray-900 via-black to-indigo-950";
  const darkText = 'text-gray-400';
  const purpleAccent = 'text-indigo-300 ';
  const cardDarkBg = 'bg-gray-800';
  const cardShadow = 'shadow-md'; // Subtle shadow
  const hoverEffect = 'transition transform hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-600/20'; // Refined hover

  return (
    <div className={`min-h-screen ${darkBg} text-white`}>
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="pt-28 px-4 pb-12">
        <h2 className={`text-4xl mt-10 font-bold text-center mb-20 drop-shadow-md ${purpleAccent}`}>
          {hotelData?.name} - Available Rooms
        </h2>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((room, i) => (
              <div
                key={i}
                className={`${cardDarkBg} rounded-xl ${cardShadow} p-6 ${hoverEffect} cursor-pointer flex flex-col`} // Removed justify-between
                onClick={() => navigate(`/room/${hotelData?._id}/${room._id}`)}
              >
                <div>
                  <h3 className={`text-2xl font-semibold mb-6 flex justify-center ${purpleAccent}`}>{room.title}</h3> {/* Increased title size */}
                  <p className={`text-md ${darkText} mb-4`}>{room.desc}</p> {/* description */}
                </div>
                <div className="flex items-center justify-between mt-4"> {/* Flex for price and persons */}
                  <div>
                    <p className={`text-sm ${darkText} `}><span className="font-semibold text-white">Price:</span> <span className="text-green-400">${room.room_price}</span></p>
                    <p className={`text-sm ${darkText}`}>
                      <span className="font-semibold text-white">Max Persons:</span> {room.maxPerson}
                    </p>
                  </div>
                  <button
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/room/${hotelData?._id}/${room._id}`);
                    }}
                  >
                    View Details <FaArrowRight className="inline ml-1 animate-pulse" />
                  </button>
                </div>
              </div>
            ))}
            {!data || data.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className={`${darkText} italic`}>No rooms available for this hotel yet.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;