import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Determine socket URL: use env var or default to current host + port 5000
            // If VITE_API_URL is 'http://localhost:5000/api', we probably want 'http://localhost:5000'
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const socketUrl = apiUrl.replace('/api', '');

            const newSocket = io(socketUrl);
            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
