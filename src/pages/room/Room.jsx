import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import { SocketContext } from '../../context/SocketContext';

const API_URL = 'https://bookify-v2-2.onrender.com';

const Room = () => {
    const { socket } = useContext(SocketContext);
    const { hotelId, roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomNumbers, setRoomNumbers] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookingDates, setBookingDates] = useState([]);
    const [searchDetails, setSearchDetails] = useState(null);

    useEffect(() => {
        const handleConnect = () => {
            console.log("Connected to server");
        };

        const handleRoomBooked = (data) => {
            console.log("Room booked:", data);
            fetchData();
        };


        socket?.on("connect", handleConnect);
        socket?.on("roomBooked", handleRoomBooked);

        return () => {
            socket?.off("connect", handleConnect);
            socket?.off("roomBooked", handleRoomBooked);

        };
    }, [socket]);

    const fetchSearchDetails = () => {
        const savedSearchDetails = localStorage.getItem('searchState');
        if (savedSearchDetails) {
            const parsedDetails = JSON.parse(savedSearchDetails);
            setSearchDetails(parsedDetails);

            if (parsedDetails.date.length > 0) {
                const startDate = new Date(parsedDetails.date[0].startDate);
                const endDate = new Date(parsedDetails.date[0].endDate);
                const tempDates = [];
                for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                    tempDates.push(new Date(d).toISOString().split('T')[0]);
                }
                setBookingDates(tempDates);
            }
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/api/rooms/${roomId}`);
            setRoom(response.data);
            setRoomNumbers(response.data.roomNumbers);

            setSearchDetails(prevDetails => {
                const updatedDetails = { ...prevDetails, price: response.data.room_price };
                localStorage.setItem('searchState', JSON.stringify(updatedDetails));
                return updatedDetails;
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        fetchSearchDetails();
        fetchData();
    }, [roomId, fetchData]);

    if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-xl text-red-500">Error loading data</div>;

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    const handleBookRoom = async () => {
        if (!selectedRoom || bookingDates.length === 0) return;
        setShowModal(false);

        try {
            await axios.put(`${API_URL}/api/rooms/availability/${selectedRoom._id}`, {
                dates: bookingDates,
            });
            socket.emit("roomBooked", { roomId, roomNumber: selectedRoom.number });
            navigate(`/bookings/${hotelId}/${roomId}/invoice`);
        } catch (err) {
            console.error(err);
            alert('Failed to book the room.');
        }
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString() : 'N/A';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 text-white">
            {/* Full-Width Sticky Navbar with Subtle Transparency */}
            <Navbar className="sticky top-0 z-50 bg-black/50 backdrop-blur-md shadow-md" />

            {/* Main Content Area - Full Width with Centralized Content */}
            <div className="container mx-auto px-6 py-24">


                {/* Hero Section - Minimalist */}
                <section className="mb-10 mt-10 text-center flex flex-col items-center justify-center">
                    <h2 className="text-5xl font-extrabold text-indigo-400 tracking-tight leading-tight drop-shadow-md animate__animated animate__fadeInDown animate__duration-700">
                        {room?.title}
                    </h2>
                    <p className="text-gray-300 mt-8 text-lg max-w-3xl opacity-70 animate__animated animate__fadeIn animate__delay-500 animate__duration-700">
                        {room?.desc}
                    </p>
                </section>

                {/* Key Details - Horizontal Minimalist List */}
                <section className="mb-10 flex justify-center items-center space-x-16 text-gray-300">
                    <div className="flex items-center rounded-full bg-green-900/20 px-4 py-2">
                        <div className="rounded-full bg-green-700/40 p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.879c.586.586 1.541.586 2.121 0l.88-.879c.586-.586 1.541-.586 2.121 0l.879.879m-6-2.818l.879.879c.586.586 1.541.586 2.121 0l.88-.879c.586-.586 1.541-.586 2.121 0l.879.879" />
                            </svg>
                        </div>
                        <span className="font-semibold text-white">Price:</span>
                        <span className="ml-1 text-green-400 text-lg">${room?.room_price}</span>
                    </div>
                    <div className="flex items-center rounded-full bg-indigo-900/20 px-4 py-2">
                        <div className="rounded-full bg-indigo-700/40 p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372m-16.5 0a9.38 9.38 0 012.625-.372M6.375 18.75a9.39 9.39 0 00-.375-1.575m15.75 0a9.39 9.39 0 01.375-1.575M12 18.375l-4.875-1.5a9.364 9.364 0 01-.43-1.298m9.75 0l4.875-1.5a9.364 9.364 0 00.43-1.298M12 15.75l-4.875 1.5a9.364 9.364 0 01-.43 1.298m9.75 0l4.875 1.5a9.364 9.364 0 00.43 1.298M12 13.125l-4.875-1.5a9.363 9.363 0 01-1.42-.875m9.75 0l4.875-1.5a9.363 9.363 0 011.42-.875M12 10.5l-4.875 1.5a9.363 9.363 0 01-1.42.875m9.75 0l4.875 1.5a9.363 9.363 0 011.42.875" />
                            </svg>
                        </div>
                        <span className="font-semibold text-white">Max:</span>
                        <span className="ml-1 text-indigo-300 text-lg">{room?.maxPerson}</span>
                        <span className="ml-1 text-gray-400 text-sm">Persons</span>
                    </div>
                </section>

                {searchDetails && (
                    <section className="mb-20 text-gray-300 flex flex-col items-center">
                        <h3 className="text-3xl font-semibold text-indigo-400 mb-10 tracking-wider mt-8">Search Overview</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="flex items-center gap-2 text-sm bg-indigo-500/10 text-indigo-200 px-4 py-2 rounded-full shadow-sm">
                                <span className="font-semibold text-white">City:</span> {searchDetails.city}
                            </span>
                            <span className="flex items-center gap-2 text-sm bg-green-500/10 text-green-200 px-4 py-2 rounded-full shadow-sm">
                                <span className="font-semibold text-white">Check-in:</span> {formatDate(searchDetails.date[0]?.startDate)}
                            </span>
                            <span className="flex items-center gap-2 text-sm bg-rose-500/10 text-rose-200 px-4 py-2 rounded-full shadow-sm">
                                <span className="font-semibold text-white">Check-out:</span> {formatDate(searchDetails.date[0]?.endDate)}
                            </span>
                            <span className="flex items-center gap-2 text-sm bg-yellow-500/10 text-yellow-200 px-4 py-2 rounded-full shadow-sm">
                                <span className="font-semibold text-white">Adults:</span> {searchDetails.options.adult}
                            </span>
                            <span className="flex items-center gap-2 text-sm bg-purple-500/10 text-purple-200 px-4 py-2 rounded-full shadow-sm">
                                <span className="font-semibold text-white">Children:</span> {searchDetails.options.children}
                            </span>
                            <span className="flex items-center gap-2 text-sm bg-blue-500/10 text-blue-200 px-4 py-2 rounded-full shadow-sm">
                                <span className="font-semibold text-white">Rooms:</span> {searchDetails.options.room}
                            </span>
                        </div>
                    </section>
                )}

                {/* Availability - Subtle Grid */}
                <section className="mb-20">
                    <h3 className="text-3xl font-bold text-indigo-400 mb-10 text-center tracking-wide">Room Availability</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {roomNumbers.map((roomNumberObj, i) => {
                            const unavailableDates = roomNumberObj.unavailableDates.map(date =>
                                new Date(date).toISOString().split('T')[0]
                            );
                            const isAvailable = bookingDates.every(date => !unavailableDates.includes(date));
                            return (
                                <div
                                    key={i}
                                    className={`
                        relative p-6 rounded-2xl shadow-lg border backdrop-blur-lg bg-white/10 
                        transition-all duration-300 cursor-pointer
                        ${isAvailable ? 'hover:bg-green-700/30 text-white' : 'bg-red-800/30 text-white cursor-not-allowed'}
                    `}
                                    onClick={() => isAvailable && handleRoomClick(roomNumberObj)}
                                >
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-extrabold">#{roomNumberObj.number}</span>
                                            {isAvailable ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <p className={`text-sm tracking-wide ${isAvailable ? 'text-green-200' : 'text-red-200'}`}>
                                            {isAvailable ? 'Available for booking' : 'Currently Booked'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>


                {/* Booking Modal - Modern Style */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md z-50">
                        <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white">
                            <h2 className="text-2xl font-bold text-indigo-300 mb-6">Confirm Booking</h2>
                            <p className="mb-4">Book room <span className="font-semibold">{selectedRoom?.number}</span>?</p>
                            <div className="flex justify-end gap-4">
                                <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200" onClick={handleCloseModal}>Cancel</button>
                                <button className="bg-indigo-500 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-400 transition-colors duration-200" onClick={handleBookRoom}>Book Now</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Room;