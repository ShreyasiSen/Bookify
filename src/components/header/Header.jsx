import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useContext, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

const Header = () => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({ adult: 1, children: 0, room: 1 });
  const navigate = useNavigate();
  const { setSearch } = useContext(SearchContext);
  const token = localStorage.getItem('token');

  const handleOption = (name, operation) => {
    setOptions(prev => ({
      ...prev,
      [name]: operation === "i" ? prev[name] + 1 : Math.max(prev[name] - 1, 0),
    }));
  };

  const handleSearch = () => {
    setSearch({ city: destination, date, options });
    navigate("/hotels");
  };

  const headerStyle = {
    backgroundImage: `url('/hero.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'overlay',
    // Dark overlay
    backgroundRepeat: 'no-repeat',
  };

   const datePickerRef = useRef();
  const buttonRef = useRef();
   const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenDate(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header px-4 md:px-12 pt-32 md:pt-40 pb-16 h-[90vh] text-white" style={headerStyle}>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-y-12 md:gap-y-16 md:gap-x-16 lg:gap-x-32">

        {/* Left Side - Text */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            Discover Your Ideal Stay
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-md mx-auto md:mx-0">
            Effortlessly book top-rated hotels,<br />
            plan your perfect vacation, and <br />
            travel smarter with us.
          </p>
          <div className="flex justify-center md:justify-start gap-4 flex-wrap">
            {!token && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-5 py-2 font-semibold bg-gradient-to-tr  from-blue-800 via-blue-500 to-purple-400  hover:opacity-90 text-white rounded-md shadow-md transition text-md"
                onClick={() => navigate("/login")}
              >
                Sign In
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="px-5 py-2 font-semibold bg-gradient-to-bl  from-blue-800 via-blue-500 to-purple-400 hover:opacity-90 text-white rounded-md shadow-md transition text-md"
              onClick={() => navigate("/search")}
            >
              GeoSearch
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side - Search Box */}
        <motion.div
          className="w-full md:w-2/5 lg:w-1/3 bg-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/30 space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        >
          {/* Destination Input */}
          <div className="flex items-center gap-3 bg-white/30 px-4 py-3 rounded-lg">
            <FontAwesomeIcon icon={faBed} className="text-sky-500" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="bg-transparent placeholder-sky-100 text-white focus:outline-none w-full text-sm"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Date Picker */}
          <div className="relative z-10">
        <div
          className="flex items-center gap-3 bg-white/30 px-4 py-3 rounded-lg cursor-pointer"
          onClick={() => setOpenDate(true)}
        >
          <FontAwesomeIcon icon={faCalendarDays} className="text-sky-500" />
          <span className="text-sm text-white truncate">
            {format(date[0].startDate, 'dd/MM/yyyy')} - {format(date[0].endDate, 'dd/MM/yyyy')}
          </span>
        </div>
      </div>

      {openDate && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-xl max-w-sm w-[90vw] sm:w-[500px] shadow-2xl"
          >
            <DateRange
              onChange={(item) => setDate([item.selection])}
              ranges={date}
              minDate={new Date()}
              moveRangeOnFirstSelection={false}
            />
            <button
              onClick={() => setOpenDate(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </div>
      )}


          {/* Guest Options */}
          <div className="relative">
            <div
              className="flex items-center gap-3 bg-white/30 px-4 py-3 rounded-lg cursor-pointer"
              onClick={() => setOpenOptions(!openOptions)}
            >
              <FontAwesomeIcon icon={faPerson} className="text-sky-500" />
              <span className="text-sm text-white">
                {options.adult} Adult · {options.children} Children · {options.room} Room
              </span>
            </div>
            {openOptions && (
              <div className="absolute bg-white text-black shadow-xl rounded-xl p-4 mt-2 z-50 w-64">
                {['adult', 'children', 'room'].map((type, idx) => (
                  <div key={idx} className="flex justify-between items-center mb-3">
                    <span className="capitalize text-sky-600 text-sm">{type}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOption(type, 'd')}
                        className="px-2 py-1 bg-sky-400 rounded hover:bg-sky-500 text-xs text-white"
                      >
                        -
                      </button>
                      <span className="text-sm text-sky-700">{options[type]}</span>
                      <button
                        onClick={() => handleOption(type, 'i')}
                        className="px-2 py-1 bg-sky-400 rounded hover:bg-sky-500 text-xs text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={handleSearch}
              className="w-full md:w-2/3 py-2 text-md md:text-lg bg-gradient-to-tl from-blue-800 via-blue-500 to-purple-400  hover:opacity-90 text-white font-medium rounded-lg transition shadow-md"
            >
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </div>

  );
};

export default Header;
