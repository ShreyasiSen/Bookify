import React from 'react';
import useFetch from '../../hooks/useFetch';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const FeaturedProperties = () => {
    const API_URL = 'https://bookify-v2-2.onrender.com';
    const { data, loading } = useFetch(`${API_URL}/api/hotels`);
    const images = [
        "https://media-cdn.tripadvisor.com/media/vr-splice-j/02/fd/34/58.jpg",
        "https://www.hotelscombined.in/himg/72/65/11/leonardo-67120291-Tower_178558_O-359871.jpg",
        "https://assets.simpleviewinc.com/simpleview/image/upload/c_fit,w_1000,h_800/crm/cooperstownny/13090501_27_0_a0f2590b-5056-a36a-076e7c5cf8418ac0.jpg",
        "https://ak-d.tripcdn.com/images/200t10000000og9nd2120_R_960_660_R5_D.jpg"
    ];

    const bgColors = ["bg-[#2e2b3a]", "bg-[#1f2d3d]", "bg-[#2b2f3a]", "bg-[#24292e]"];
    const featureSets = [
        ["Free Wi-Fi", "Pet Friendly", "Spa Access"],
        ["Rooftop Pool", "Fitness Center", "24/7 Support"],
        ["City View", "Free Breakfast", "Mini Bar"],
        ["Garden Access", "Eco-Friendly", "Lounge Bar"]
    ];

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        },
        hover: { scale: 1.03 },
    };

    return (
        <section className="w-full bg-gradient-to-b from-purple-900 via-[#111] to-black text-white py-10 px-6">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                    Featured Properties
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <div className="loader border-t-4 border-b-4 border-cyan-400 rounded-full w-10 h-10 animate-spin"></div>
                    </div>
                ) : (
                    <motion.div
                        className="flex flex-col gap-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {data && images.map((img, i) => (
                            <motion.div
                                key={i}
                                className={`${bgColors[i % bgColors.length]} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 cursor-pointer group flex flex-col md:flex-row`}
                                variants={cardVariants}
                                whileHover="hover"
                                onClick={() => window.location.href = `/hotel/${data[i]?._id}`}
                            >
                                <img
                                    src={img}
                                    alt={`Property ${i}`}
                                    className="w-full md:w-1/2 h-64 object-cover rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="p-6 flex flex-col justify-between h-full md:w-2/3">
                                    <div>
                                        <h3 className="text-2xl font-extrabold tracking-wide mb-1 text-white">
                                            {data[i]?.name}
                                        </h3>
                                        <p className="text-indigo-300 text-sm mb-3 italic">
                                            {data[i]?.city}
                                        </p>

                                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                            {data[i]?.desc || "Discover tranquility with premium comfort, curated for discerning guests."}
                                        </p>

                                        <div className="flex flex-wrap text-xs text-gray-100 gap-2 mb-4">
                                            {featureSets[i % featureSets.length].map((feat, idx) => (
                                                <span key={idx} className="bg-[#00000033] px-3 py-1 rounded-full border border-gray-500">{feat}</span>
                                            ))}
                                        </div>

                                        {data[i]?.rating && (
                                            <div className="mb-3 flex items-center">
                                                <span className="bg-cyan-500 text-sm px-2 py-1 rounded-md text-white font-semibold mr-2">
                                                    {data[i].rating}
                                                </span>
                                                <span className="text-sm text-gray-400">Excellent</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-cyan-300 text-lg font-semibold">
                                            Starting from ${data[i]?.cheapestPrice}
                                        </p>
                                        <button
                                            className={`bg-gradient-to-tr  from-blue-900 via-blue-700 to-purple-600  px-4 py-2 text-md hover:brightness-110 transition rounded-xl font-medium shadow-md`}
                                        >
                                            View Details <FaArrowRight className="inline-block animate-ping ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProperties;
