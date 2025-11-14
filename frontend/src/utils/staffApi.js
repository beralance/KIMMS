import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch allowed modules/permissions for a staff user
 * @param {string} userId - The staff user's ID
 * @param {string} token - Bearer token
 * @returns {Promise<Array>} - List of allowed modules
 */
export const fetchStaffPermissions = async (userId, token) => {
    try {
        const res = await axios.get(
            `${API_URL}/api/staff-permissions/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res.data.allowedModules || [];
    } catch (err) {
        console.error(
            "Error fetching staff permissions:",
            err.response?.data || err.message
        );
        return [];
    }
};
