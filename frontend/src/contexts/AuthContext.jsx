import React, { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";
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
                    return parsed;
                }
            } catch (err) {
                return null;
            }
        }
        return null;
    });

    const login = (newData) => {

        console.log('LKASJKFJKALSJD', newData)
        const existingUser = JSON.parse(localStorage.getItem("user")) || {};

        const updatedUser = { ...existingUser, ...newData };

        setUser(updatedUser);

        localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    
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
