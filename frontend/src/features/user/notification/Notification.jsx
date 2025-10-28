import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Stack, Divider, CircularProgress } from "@mui/material";
import { CheckCircle, Bell, Clock } from "lucide-react";
import { fetchNotifications, markNotificationAsRead } from "../../../utils/notificationApi";
import { useAuth } from "../../../contexts/AuthContext";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth()
    const token = user.token

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications(token);
                setNotifications(data);
                console.log('TEST', data)
            } catch (err) {
                console.error("Failed to load notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, [token]);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead({id: user.userId, token});
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    console.log('Notification', notifications)

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "auto",
                mt: 4,
                p: 2,
                borderRadius: 2,
                bgcolor: "#fff",
                boxShadow: 2,
            }}
        >
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Notifications
            </Typography>

            {notifications.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    No notifications yet.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {notifications.map((notif) => (
                        <Box
                            key={notif._id}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: notif.read ? "#f8f8f8" : "#e8f4ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                <Bell size={20} />
                                <Box>
                                    <Typography variant="body1">
                                        {notif.message}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                        <Clock size={14} />
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {!notif.read && (
                                <IconButton onClick={() => handleMarkAsRead(notif._id)} color="primary">
                                    <CheckCircle size={20} />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default Notification;
