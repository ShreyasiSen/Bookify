import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const HotelIntro = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://bookify-v2-2.onrender.com';
    const darkBg = 'bg-gradient-to-bl from-black via-gray-900 to-purple-900';
    const darkText = 'text-gray-300';
    const purpleAccent = 'text-indigo-400';
    const subtlePurpleBg = 'bg-purple-900/10';

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/hotels/${id}`);
                setHotel(response.data);
                console.log(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
    }, [id, API_URL]);

    if (loading) return (
        <div className={`min-h-screen ${darkBg} flex justify-center items-center`}>
            <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
        </div>
    );

    if (error) return <div className={`min-h-screen ${darkBg} text-center mt-20 text-xl text-red-500`}>Error loading data</div>;

    return (
        <div className={`min-h-screen ${darkBg} text-white flex flex-col items-center`}>
            {/* Floating Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md shadow-lg">
                {Navbar && <Navbar />}
            </div>

            <div className="container mx-auto px-4 pt-20 pb-16 mt-20 sm:pt-24 md:pt-32 w-full lg:w-4/5 xl:w-3/4">
                <div className="flex flex-col lg:flex-row gap-20 justify-center items-center">
                    {/* Removed Image Section */}

                    {/* Details Section */}
                    <div className="flex flex-col justify-center lg:w-1/2">
                        <h1 className={`text-4xl font-bold tracking-tight mb-4 ${purpleAccent}`}>
                            {hotel?.name}
                        </h1>
                        <p className={`text-lg ${darkText} mb-4`}>
                            Located in <span className={`italic text-xl ${purpleAccent}`}>{hotel?.city}</span>
                        </p>
                        <div className={`mb-6 p-4 rounded-md ${subtlePurpleBg} border-l-4 border-indigo-500`}>
                            <h3 className={`text-xl font-semibold ${purpleAccent} mb-2`}>About this stay</h3>
                            <p className={`text-sm ${darkText}`}>{hotel?.desc}</p>
                        </div>
                        <div className={`mb-4 p-4 rounded-md ${subtlePurpleBg}`}>
                            <p><b className="text-white">Address:</b> <span className={darkText}>{hotel?.address}</span></p>
                            <p><b className="text-white">Price:</b> <span className="text-green-400">${hotel?.cheapestPrice} per night</span></p>
                            {hotel?.rating && (
                                <p><b className="text-white">Rating:</b> <span className="text-yellow-400">{hotel.rating}</span></p>
                            )}
                            {hotel?.features && hotel.features.length > 0 && (
                                <div>
                                    <b className="text-white">Features:</b>
                                    <ul className="list-disc ml-6 mt-2">
                                        {hotel.features.map((feature, index) => (
                                            <li key={index} className={darkText}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button
                            className={`relative bg-gradient-to-br from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-md shadow-md overflow-hidden transition-all duration-300
                hover:shadow-lg hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                group`}
                            onClick={() => navigate(`/hotel/${id}`)}
                        >
                            <span className="relative z-10">View Availability</span>
                            <svg className="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">

                                <path strokeLinecap="round" strokesLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 01-18 0 9 9 0 0118 0z" />

                            </svg>
                            {/* Glow Effect */}
                            <div className="absolute top-0 left-0 w-full h-full bg-indigo-400 opacity-0 rounded-md filter blur-lg transition-opacity duration-500 group-hover:opacity-80"></div>
                            {/* Subtle Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 rounded-md"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelIntro;
