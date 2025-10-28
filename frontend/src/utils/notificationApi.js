// src/api/notificationApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch all notifications for the logged-in user
export const fetchNotifications = async (token) => {
    try {
        const res = await axios.get(`${API_URL}/api/auction-notifications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error("Error fetching notifications:", err.response?.data || err.message);
        throw err;
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (id, token) => {
    try {
        const res = await axios.patch(`${API_URL}/api/auction-notifications/${id}/read`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error("Error marking notification as read:", err.response?.data || err.message);
        throw err;
    }
};
