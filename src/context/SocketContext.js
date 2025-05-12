import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client"; 

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const API_URL = process.env.NODE_ENV === 'production' ? 'https://bookify-v2-2.onrender.com' : 'http://localhost:8080';
         const newSocket = io(API_URL, {
            transports: ["websocket", "polling"],
          
          
        });
        
        console.log("Initializing Socket.IO client:", newSocket);
        setSocket(newSocket);
    
    }, []);
    
    

    return (
        <SocketContext.Provider value={{  socket }}>
            {children}
        </SocketContext.Provider>
    );
};
