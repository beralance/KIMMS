import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getPaymentStatus = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/payment/status/${orderId}`);
        return response.data;
    }
    catch(error) {
        console.error("Error fetching payment status ", error)
        throw error.response?.data || error.message;
    }
}
