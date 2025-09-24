import React, { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode"; // fixed import
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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

    const login = ({ userId, fullName, role, token, allowedModules }) => {
        setUser({ userId, fullName, role, token, allowedModules });
        localStorage.setItem("user", JSON.stringify({ userId, fullName, role, token, allowedModules }));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, token: user?.token }}>
            {children}
        </AuthContext.Provider>
    );
};
