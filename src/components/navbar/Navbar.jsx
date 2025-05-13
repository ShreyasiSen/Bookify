import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSpinner, FaBars } from 'react-icons/fa'; // Import FaBars for mobile menu
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://bookify-v2-2.onrender.com';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch profile data on mount
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: token },
        });
        setIsLoggedIn(true);
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate('/');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Loading spinner while fetching data
  if (loading) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center items-center h-12 bg-transparent">
        <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
      </div>
    );
  }

  return (
    <>
      {/* Backdrop when menu is open on mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-screen-lg transition-all duration-300 ease-in-out rounded-full ${isScrolled
            ? 'bg-white shadow-md text-gray-800'
            : 'bg-white/50 backdrop-blur-md text-white'
          }`}
      >
        <div className="container mx-auto w-full max-w-[95%] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg flex justify-between items-center py-2 px-4 md:px-6 lg:px-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-sm md:text-lg font-extrabold tracking-wide">
              <span className={`${isScrolled ? 'text-indigo-500' : 'text-indigo-800'}`}>BOOKIFY</span>
              <span className="text-yellow-400">v2</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/register"
                  className={`px-2 py-1 rounded-md font-semibold transition duration-200 ease-in-out text-sm md:text-base ${isScrolled
                      ? 'bg-indigo-100 text-indigo-500 hover:bg-indigo-200'
                      : 'bg-indigo-100 text-indigo-500 hover:bg-indigo-200'
                    }`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`px-2 py-1 rounded-md font-semibold transition duration-200 ease-in-out text-sm md:text-base ${isScrolled
                      ? 'bg-indigo-100 text-indigo-500 hover:bg-indigo-200'
                      : 'bg-indigo-100 text-indigo-500 hover:bg-indigo-200'
                    }`}
                >
                  Login
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3 lg:space-x-4">
                {profileData?.img ? (
                  <Link to="/profile">
                    <img
                      src={profileData.img}
                      alt="Profile"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover cursor-pointer hover:opacity-80"
                    />
                  </Link>
                ) : (
                  <Link to="/profile">
                    <FaUserCircle
                      className={`text-xl md:text-2xl cursor-pointer ${isScrolled ? 'text-gray-600 hover:text-indigo-500' : 'text-gray-300 hover:text-yellow-400'
                        }`}
                    />
                  </Link>
                )}
                <div className="hidden md:block text-xs lg:text-sm">
                  <Link
                    to="/profile"
                    className={`font-semibold hover:underline ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                  >
                    {profileData?.username}
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className={`px-2 py-1 rounded-md font-semibold transition duration-200 ease-in-out text-sm md:text-base ${isScrolled
                      ? 'bg-red-100 text-red-500 hover:bg-red-200'
                      : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-[4.5rem] left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-xs backdrop-blur-md bg-white/20 border border-white/30 shadow-lg px-6 py-4 transition-all duration-300 ease-in-out rounded-xl">
            {!isLoggedIn ? (
              <div className="flex flex-col space-y-3 text-center">
                <Link
                  to="/register"
                  className="text-white font-medium py-2 px-4 bg-cyan-600 hover:bg-cyan-700 rounded-md transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-white font-medium py-2 px-4 bg-cyan-600 hover:bg-cyan-700 rounded-md transition"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 text-center">
                <Link
                  to="/profile"
                  className="text-white font-medium py-2 px-4 bg-gray-700 hover:bg-gray-800 rounded-md transition"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium py-2 px-4 bg-white hover:bg-red-100 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </nav>
    </>
  );
};

export default Navbar;