import axios from "axios";

const LOCATION_API_KEY = process.env.LOCATION_API_KEY;

export const reverseGeocode = async (lat, lon) => {
    try {
        const res = await axios.get("https://us1.locationiq.com/v1/reverse.php", {
            params: { key: LOCATION_API_KEY, lat, lon, format: "json" },
        });
        return res.data;
    } catch (err) {
        console.error("LocationIQ error:", err.message);
        return null;
    }
};
