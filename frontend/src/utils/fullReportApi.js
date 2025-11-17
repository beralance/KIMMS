import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchFullReport = async (range = "all") => {
    try {
        const res = await axios.get(`${API_URL}/api/full-report`, {
            params: { range },
        });

        return res.data.data;
    } catch (err) {
        console.error("Error fetching full report: ", err);
        throw err;
    }
};
