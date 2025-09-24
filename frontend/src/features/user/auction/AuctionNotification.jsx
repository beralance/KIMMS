import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const AuctionNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const {token} = useAuth()

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/notifications/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (notifications.length === 0) return <Typography>No notifications</Typography>;

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" gutterBottom>
                Notifications
            </Typography>

            {notifications.map((n) => (
                <Card
                    key={n._id}
                    sx={{
                        mb: 2,
                        backgroundColor: n.read ? "#f5f5f5" : "#e3f2fd",
                    }}
                >
                    <CardContent>
                        <Typography variant="body1">{n.message}</Typography>
                        <Typography variant="caption" color="textSecondary">
                            {new Date(n.createdAt).toLocaleString()}
                        </Typography>
                        {!n.read && (
                            <Button
                                size="small"
                                sx={{ ml: 2 }}
                                onClick={() => markAsRead(n._id)}
                            >
                                Mark as Read
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default AuctionNotifications;
