import React, { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode"; // fixed import
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            try {
                const decoded = jwtDecode(parsed.token);
                if (decoded.exp * 1000 > Date.now()) {
                    return parsed; // still valid
                }
            } catch (err) {
                return null;
            }
        }
        return null;
    });

    const login = (newData) => {

        console.log('LKASJKFJKALSJD', newData)
        // Get existing user from localStorage
        const existingUser = JSON.parse(localStorage.getItem("user")) || {};

        // Merge existing data with new data
        const updatedUser = { ...existingUser, ...newData };

        // Update React context state
        setUser(updatedUser);

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    /*
    const login = ({ userId, fullName, avatar, role, token, address, allowedModules, isLocal}) => {
        setUser({ userId, fullName, avatar, role, token, address, allowedModules, isLocal });
        localStorage.setItem("user", JSON.stringify({ userId, fullName, avatar, role, token, address, allowedModules, isLocal }));
    };
    */

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate('/')
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, token: user?.token }}>
            {children}
        </AuthContext.Provider>
    );
};
