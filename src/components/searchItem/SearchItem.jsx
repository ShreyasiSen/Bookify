import React from 'react';
import { Link } from 'react-router-dom';

const SearchItem = ({ item }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.4)] transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
      
      {/* Image Section */}
      <div className="w-full sm:w-60 h-44 rounded-xl overflow-hidden shadow-inner shadow-black/30">
        <img
          src={item?.photos[0]}
          alt={item?.name}
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-grow space-y-3">
        <div>
          <h2 className="text-2xl font-semibold text-indigo-400 tracking-wide leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {item?.name}
          </h2>
          <p className="text-sm text-gray-400 font-light">{item?.distance}m from city center — ideal for a quick getaway</p>
          
          {item?.freeAirportTaxi && (
            <span className="inline-block mt-2 text-xs font-semibold text-white bg-green-600/90 px-4 py-1 rounded-full shadow-sm">
              Enjoy Free Airport Taxi Service
            </span>
          )}

          <h3 className="mt-3 text-lg text-gray-300 font-medium">
            {item?.roomType || 'Cozy Studio Apartment'} • A/C & Modern Amenities Included
          </h3>
          <p className="text-sm text-gray-400 line-clamp-3">{item?.desc}</p>

          {item?.freeCancellation && (
            <p className="mt-2 text-sm text-green-500 font-medium italic">Free cancellation — Book with peace of mind!</p>
          )}
          {item?.lockInPrice && (
            <p className="text-xs text-green-400 font-medium">Lock in this unbeatable price today and save!</p>
          )}
        </div>
      </div>

      {/* Price & Rating Section */}
      <div className="flex flex-col items-end justify-between sm:w-48 text-right">
        {item?.rating && (
          <div className="flex items-center justify-end mb-4">
            <span className="text-gray-300 text-sm font-medium mr-2">Highly Rated</span>
            <span className="bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
              {item?.rating} ★
            </span>
          </div>
        )}

        <div>
          <p className="text-white text-2xl font-extrabold tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]">
            ${item?.cheapestPrice} / night
          </p>
          <p className="text-xs text-gray-500 mt-1">Includes all taxes & fees — no surprises!</p>
          <Link to={`/hotels/${item._id}`}>
            <button className="w-full mt-4 py-3  text-white rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg">
              Check Availability & Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
