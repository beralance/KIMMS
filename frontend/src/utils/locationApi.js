import axios from "axios";
import { UserRoundIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL

export const saveUserLocation = async (userId, latitude, longitude) => {
    try {
        const response = await axios.post(`${API_URL}/api/location/save`, {
            userId,
            latitude,
            longitude
        })
        return response.data
    }
    catch (err) {
        console.error('Error saving user location: ', err)
        throw err
    }
}

export const getUserLatestLocation = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/api/location/${userId}`)
        return response.data
    }
    catch (err) {
        console.error('Error fetching user location:', err);
        throw error;
    }
}