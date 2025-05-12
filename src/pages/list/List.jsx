import { format } from 'date-fns';
import React, { useState, useContext, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import Navbar from '../../components/navbar/Navbar';
import SearchItem from '../../components/searchItem/SearchItem';
import { SearchContext } from '../../context/SearchContext';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const List = () => {
  const { city, date, options, setSearch } = useContext(SearchContext);
  const [destination, setDestination] = useState(city);
  const [openDate, setOpenDate] = useState(false);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
    }
  }, [error]);

  const API_URL = 'https://bookify-v2-2.onrender.com';

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hotels?city=${city}&min=${min || 1}&max=${max || 40000}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    getData();
  }, [city, min, max]);

  const handleClick = () => {
    setSearch({ city: destination, date, options });
    const getData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hotels/search?city=${destination}&min=${min || 1}&max=${max || 40000}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    getData();
  };

  return (
    <div className="bg-gradient-to-br from-black  via-purple-900 to-gray-900 min-h-screen text-white">
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Assuming Navbar is a component you have */}
          <Navbar />
        </div>
      </div>
      <div className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Sidebar Search Card */}
        <aside className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 sticky top-8">
            <h2 className="text-xl font-semibold text-white mb-6">Refine Your Search</h2>

            {/* Destination Input */}
            <div className="mb-4">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
              <input
                id="destination"
                value={destination}
                onChange={e => {
                  const value = e.target.value;
                  setDestination(value);
                  if (value === "") {
                    setSearch({ city: "", date, options }); // Reset filter if cleared
                  }
                }}
                placeholder={city}
                type="text"
                className="w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
              />

            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <label htmlFor="checkin" className="block text-sm font-medium text-gray-300 mb-2">Check-in Date</label>
              <div className="relative">
                <div
                  onClick={() => setOpenDate(!openDate)}
                  className="w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer flex justify-between items-center bg-gray-700 text-white"
                >
                  <span>
                    {date.length > 0
                      ? `${format(new Date(date[0].startDate), "MMM dd, yyyy")} - ${format(
                        new Date(date[0].endDate),
                        "MMM dd, yyyy"
                      )}`
                      : <span className="text-gray-500">Select Dates</span>}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {openDate && (
                  <div className="absolute top-full left-0 z-10 mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700">
                    <DateRange
                      onChange={(item) =>
                        setSearch({ city: destination, date: [item.selection], options })
                      }
                      minDate={new Date()}
                      ranges={date}
                      className="rounded-md shadow-md"
                      color="#4f46e5"
                      rangeColors={["#4f46e5"]}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Price Filters */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Price Range (per night)</label>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label htmlFor="min-price" className="block text-xs font-medium text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    onChange={e => setMin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    placeholder="₹"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="max-price" className="block text-xs font-medium text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    onChange={e => setMax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    placeholder="₹"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleClick}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              Search Hotels
            </button>
          </div>
        </aside>

        {/* Results Section */}
        <main className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-white tracking-tight">Explore Stays</h1>
            {data?.length > 0 && (
              <span className="text-lg text-gray-400">{data.length} results</span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 bg-gray-900 rounded-xl">
              <svg className="animate-spin h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 009.828 16.718m5.978-1.718A8.002 8.002 0 0115.414 9V4m0 0L9.828 15.282m5.978-1.718A8.001 8.001 0 0112 2.25m-5.828 13.856a8.001 8.001 0 0013.172-7.718m-13.172-7.718a8.002 8.002 0 0111.656 2.03" />
              </svg>
            </div>
          ) : (
            <div className="space-y-8">
              {data?.length > 0 ? (
                data.map(item => (
                  <div
                    key={item._id}
                    className=" rounded-xl border border-gray-700 p-4 shadow-md hover:shadow-xl hover:ring-1 hover:ring-indigo-500 transition duration-300"
                  >
                    <SearchItem item={item} />
                  </div>
                ))
              ) : (
                <div className="bg-gray-900 rounded-md p-8 text-center border border-gray-700">
                  <p className="text-gray-500 italic text-lg">No properties found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </main>


      </div>
    </div>

  );
}

export default List;
