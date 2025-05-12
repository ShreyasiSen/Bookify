import React from 'react';
import { FaCheckCircle, FaHeadset, FaLock, FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WhyBookWithUs = () => {
    const features = [
        {
            icon: <FaCheckCircle className="text-green-400 text-4xl md:text-5xl" />,
            title: "Verified Listings",
            desc: "Only genuine and verified hotels you can trust. Our team meticulously inspects and approves every listing to ensure top quality and transparency.",
            img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        },
        {
            icon: <FaWallet className="text-yellow-300 text-4xl md:text-5xl" />,
            title: "Best Price Guarantee",
            desc: "Enjoy unmatched deals with zero compromise on quality. No hidden charges, ever. Transparent pricing is at our core.",
            img: "./W2.jpg"
        },
         {
            icon: <FaHeadset className="text-pink-400 text-4xl md:text-5xl" />,
            title: "24/7 Support",
            desc: "Our dedicated support team is available round the clock. Whether it’s a booking issue or a last-minute change—we’ve got your back.",
            img: "./W4.png"
        },
        {
            icon: <FaLock className="text-blue-400 text-4xl md:text-5xl" />,
            title: "Secure Booking",
            desc: "Industry-grade encryption ensures your data is always safe. Book confidently knowing your transactions are protected.",
            img: "./W3.jpg"
        },
       
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const featureVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
        hover: { scale: 1.03, transition: { duration: 0.2 } },
    };

    const pulseAnimation = {
        initial: { scale: 1 },
        animate: { scale: 1.15, transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' } },
    };

    return (
        <section className="w-full py-20 bg-gradient-to-b from-black via-black to-purple-900 text-white px-6 relative overflow-hidden">
            {/* Animated Background Blurs */}
            <motion.div className="absolute top-1/4 left-12 w-28 h-28 rounded-full bg-purple-500 opacity-20 blur-2xl" variants={pulseAnimation} initial="initial" animate="animate" />
            <motion.div className="absolute bottom-1/3 right-24 w-32 h-32 rounded-full bg-cyan-400 opacity-20 blur-2xl" variants={pulseAnimation} initial="initial" animate={{ ...pulseAnimation.animate, transition: { ...pulseAnimation.animate.transition, delay: 0.5 } }} />
            <motion.div className="absolute top-2/3 left-40 w-24 h-24 rounded-full bg-pink-400 opacity-20 blur-2xl" variants={pulseAnimation} initial="initial" animate={{ ...pulseAnimation.animate, transition: { ...pulseAnimation.animate.transition, delay: 1 } }} />

            {/* Content */}
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-14 pb-10 bg-gradient-to-r from-indigo-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                    Why Choose Us?
                </h2>

                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 px-4" variants={containerVariants} initial="hidden" animate="visible">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            className="flex flex-col md:flex-row items-centerbg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-cyan-500/30 items-center hover:scale-[1.03]"
                            variants={featureVariants}
                            whileHover="hover"
                        >
                            {/* Image */}
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full md:w-40 h-32 md:h-40 object-cover rounded-xl mb-6 md:mb-0 md:mr-6 shadow-md"
                            />

                            {/* Text Content */}
                            <div className="text-left">
                                <div className="mb-4">{item.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyBookWithUs;
