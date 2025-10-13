import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCombinedReport = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/api/reports/combined`, {params})
        return response.data;
    }
    catch (err) {
        console.error('Error fetching combined reports: ', err)
        throw err;
    }
}