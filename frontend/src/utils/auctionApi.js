import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchAuctions = async () => {
    try {
        const {data} = await axios.get(`${API_URL}/api/auctions`)
        return data;
    }
    catch (err) {
        console.error('Problem fetching auction data: ', err)
    }
}

export const deletePendingAuction = async (auctionId, token) => {
    try {
        const res = await axios.delete(`${API_URL}/api/auctions/${auctionId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    }
    catch (err) {
        console.error('Error deleting auction: ', err.response?.data || err.message)
        throw err;
    }
}