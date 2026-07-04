import { createContext, useContext, useState, useEffect } from "react";
import { saveUserLocation } from "../utils/locationApi";
import { useAuth } from "./AuthContext";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const [status, setStatus] = useState("waiting");
    const [lastUpdated, setLastUpdated] = useState(null);

    const updateLocation = async (latitude, longitude, isManual = false) => {
        if (!user?.userId) return;

        setLocation({ latitude, longitude });
        setStatus(isManual ? "manual" : "granted");
        setLastUpdated(new Date());

        try {
            await saveUserLocation(user.userId, latitude, longitude);
        } catch (err) {
            console.error("Failed to save location", err);
        }
    };

    const checkPermissionAndUpdate = () => {
        if (!user?.userId || !navigator.geolocation || !navigator.permissions)
            return;

        navigator.permissions
            .query({ name: "geolocation" })
            .then((perm) => {
                if (perm.state === "granted" || perm.state === "prompt") {
                    navigator.geolocation.getCurrentPosition(
                        (pos) =>
                            updateLocation(
                                pos.coords.latitude,
                                pos.coords.longitude
                            ),
                        (err) => {
                            if (err.code === 1) setStatus("denied");
                            else if (err.code === 2)
                                console.warn("Position unavailable");
                            else if (err.code === 3) console.warn("Timeout");
                        },
                        { enableHighAccuracy: true, maximumAge: 60000 }
                    );

                    if (perm.state === "granted") setStatus("granted");
                    else if (perm.state === "prompt") setStatus("prompt");
                } else if (perm.state === "denied") {
                    setStatus("denied");
                }
            })
            .catch((err) => console.error("Permissions API error:", err));
    };
    useEffect(() => {
    }, [status]);

    useEffect(() => {
        checkPermissionAndUpdate();
        console.log("User ID", user?.userId);
        console.log("User ID", user?.address);
    }, [user?.userId, user?.address]);

    return (
        <LocationContext.Provider
            value={{
                location,
                status,
                lastUpdated,
                updateLocation,
                checkPermissionAndUpdate,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
