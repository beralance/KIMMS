import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


export const getBidders = async (auctionId, token) => {
    try {
        const res = await axios.get(`${API_URL}/api/bids/${auctionId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }
};
