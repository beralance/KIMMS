import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const socket = io(import.meta.env.VITE_API_URL);

export const SocketProvider = ({ children }) => (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
