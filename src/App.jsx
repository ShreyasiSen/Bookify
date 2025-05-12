import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import List from './pages/list/List';
import Hotel from './pages/hotel/Hotel';
import Room from './pages/room/Room';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import HotelSearch from './components/geo/nearby';
import HotelIntro from './pages/hotelintro/HotelIntro';
import BookingDetails from './components/bill/bill';

function App() {
  return (

      <BrowserRouter>
     
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<List />} />
          <Route path="/hotels/:id" element={<HotelIntro />} />
          <Route path="/hotel/:id" element={<Hotel />} />
          <Route path="/room/:hotelId/:roomId" element={<Room />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/search" element={<HotelSearch />} />
          <Route path="/bookings/:hotelId/:roomId/invoice" element={<BookingDetails />}/>
        </Routes>
      </BrowserRouter>

  );
}

export default App;