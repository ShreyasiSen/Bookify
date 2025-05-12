import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';
import { motion } from 'framer-motion';

const Featured = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { date, options, setSearch } = useContext(SearchContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const API_URL = 'https://bookify-v2-2.onrender.com';
                const response = await axios.get(`${API_URL}/api/hotels/countByCity`, {
                    params: {
                        cities: 'Berlin,New York,London',
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleClick = (city) => {
        setSearch({ city, date, options });
        navigate('/hotels');
    };

    const cities = [
        {
            name: 'Berlin',
            img: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/526000/526877-dublin.jpg',
        },
        {
            name: 'New York',
            img: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-688899881-1519413300.jpg?resize=1200:*',
        },
        {
            name: 'London',
            img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/02/57/44/0c/filename-img-1097-jpg.jpg?w=700&h=-1&s=1',
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2, ease: 'easeInOut' },
        },
    };

    return (
        <section className="w-full px-6 py-24 bg-gradient-to-b from-black via-black to-purple-900 text-white font-sans relative overflow-hidden">
            <div className="max-w-screen-xl mx-auto">
                <h2 className="text-4xl md:text-5xl py-4 font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-cyan-400">
                    Explore Top Destinations
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
                    </div>
                ) : (
                    <motion.div
                        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {cities.map((city, i) => (
                            <motion.div
                                key={city.name}
                                onClick={() => handleClick(city.name)}
                                className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-gray-800 transition-shadow duration-300 hover:shadow-2xl"
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <img
                                    src={city.img}
                                    alt={city.name}
                                    className="w-full h-72 object-cover rounded-xl brightness-90 transition-opacity duration-300 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-end p-4">
                                    <div className="text-left">
                                        <h3 className="text-xl font-semibold text-white">{city.name}</h3>
                                        <p className="text-sm text-gray-300">{data[i]} properties</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300" />
                                {city.name === 'London' && (
                                    <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 w-24 h-40 bg-white/30 blur-2xl opacity-60 rounded-full rotate-180 pointer-events-none" />
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Featured;
