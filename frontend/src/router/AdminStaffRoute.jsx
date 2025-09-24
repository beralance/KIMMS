import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'

const AdminOrStaffRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/auth/login" />; // not logged in
    if (user.role !== "admin" && user.role !== "staff") return <Navigate to="*" />; // allow admin or staff
    return children;
};

export default AdminOrStaffRoute;
