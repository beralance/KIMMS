import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Stack,
    Divider,
    CircularProgress,
    Button,
} from "@mui/material";
import {
    CheckCircle,
    Bell,
    Clock,
    BellIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    BellRing,
    BellRingIcon,
    MailIcon,
} from "lucide-react";
import {
    fetchNotifications,
    markNotificationAsRead,
} from "../../../utils/notificationApi";
import { useAuth } from "../../../contexts/AuthContext";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import {} from "lucide-react";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const token = user.token;
    const navigate = useNavigate();

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications(token);
                setNotifications(data);
                console.log("notification data", data);
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
            await markNotificationAsRead(id, token);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            navigate(`/notification/${id}`);
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

    console.log("Notification", notifications);

    return (
        <Stack
            gap={2}
            sx={{
                maxWidth: 600,
                margin: "auto",
                mt: 4,
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
            }}
        >
            <Stack>
                <Typography
                    variant="subtitle1"
                    color="secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                    Auction Notifications
                    <MailIcon />
                </Typography>
                <Typography variant="body2" color="gray">
                    Auction announcements and results
                </Typography>
            </Stack>

            {notifications.length === 0 ? (
                <FullScreenLoader />
            ) : (
                <Stack spacing={2}>
                    {notifications.map((notif) => (
                        <Box
                            onClick={() => handleMarkAsRead(notif._id)}
                            key={notif._id}
                            sx={{
                                cursor: "pointer",
                                p: 2,
                                borderRadius: 2,
                                bgcolor:
                                    notif.read === true ? "#ffffffff" : "white",
                                boxShadow: notif.read === true ? 0 : 4,
                                opacity: notif.read === true ? "0.8" : "1",
                                display: "flex",
                                alignItems: "center",
                                position: "relative",
                                justifyContent: "space-between",
                            }}
                        >
                            {notif.read === false && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: -3,
                                        right: -3,
                                        height: 12,
                                        width: 12,
                                        bgcolor: "error.main",
                                        borderRadius: "999px",
                                    }}
                                />
                            )}
                            <Box>
                                <Stack>
                                    <Stack
                                        direction={"row"}
                                        justifyContent={"space-between"}
                                    >
                                        <Stack
                                            direction={"row"}
                                            gap={2}
                                            alignItems={"center"}
                                        >
                                            {notif.read === true ? (
                                                <BellIcon
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        fill: "gray",
                                                        color: "gray",
                                                    }}
                                                />
                                            ) : (
                                                <BellRingIcon
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        fill: "#37353E",
                                                        color: "#37353E",
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight={"bold"}
                                            >
                                                {notif.label}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Divider sx={{ my: 1 }} />
                                    <Stack
                                        sx={{ p: 1 }}
                                        gap={
                                            notif.auctionId?.winner ===
                                            user.userId
                                                ? 3
                                                : 1
                                        }
                                    >
                                        <Typography variant="body2">
                                            {notif.message}
                                        </Typography>
                                        <Stack
                                            direction={
                                                notif.auctionId?.winner ===
                                                    user.userId && "row-reverse"
                                            }
                                            alignItems={"center"}
                                            justifyContent={"space-between"}
                                        >
                                            <Box>
                                                {notif.auctionId?.winner ===
                                                    user.userId &&
                                                    !notif.auctionId
                                                        ?.winnerClaimed &&
                                                    notif.showClaimButton && (
                                                        <Stack>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    navigate(
                                                                        `/auction-checkout/${notif.auctionId?._id}/${notif.auctionId.winner}`
                                                                    );
                                                                }}
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: 1,
                                                                }}
                                                            >
                                                                Checkout Item
                                                                <ChevronRightIcon
                                                                    style={{
                                                                        color: "white",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Stack>
                                                    )}
                                            </Box>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                alignSelf={"flex-end"}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {new Date(
                                                        notif.createdAt
                                                    ).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

export default Notification;
