import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Stack,
    Divider,
    CircularProgress,
    Button,
    Grid,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import FullScreenLoader from "../../../components/FullScreenLoader";
import SectionWrapper from "../../../components/SectionWrapper";
import { claimAuctionItem } from "../../../utils/auctionApi";
import { formatNumber } from "../../../utils/stringUtils";
import { getBidders } from "../../../utils/bidApi";
import { fetchNotifications } from "../../../utils/notificationApi";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { HourglassIcon } from "lucide-react";

const NotificationContent = () => {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();
    const { id: notifId } = useParams();
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [userBid, setUserBid] = useState("");
    const [auction, setAuction] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isWinner, setIsWinner] = useState(false);
    const [message, setMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (auction?.claimDeadline < new Date()) return;
        console.log("AUCTION AUCTION", auction);
        console.log(
            "AUCTION AUCTION",
            dayjs(auction?.claimDeadline).format("MMMM DD YYYY h:mm A")
        );
        console.log("AUCTION AUCTION", auction?.claimDeadline > new Date());
        const interval = setInterval(() => {
            const now = new Date();
            const deadline = new Date(auction.claimDeadline);
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft("Expired");
                clearInterval(interval);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [auction]);

    useEffect(() => {
        const loadNotification = async () => {
            try {
                const notifications = await fetchNotifications(user.token);
                const selected = notifications.find((n) => n._id === notifId);
                const bids = await getBidders(
                    selected.auctionId?._id,
                    user.token
                );
                const selectedBids = bids.find(
                    (b) => b.userId?._id === user.userId
                );

                const isUserWinner = selected.auctionId?.winner === user.userId;

                setNotification(selected);
                setAuction(selected.auctionId);
                setUserBid(selectedBids);
                setIsWinner(isUserWinner);
            } catch (err) {
                console.log("Error loading notifications: ", err);
            } finally {
                setLoading(false);
            }
        };
        loadNotification();
    }, [notifId, user.token]);

    const handleClaim = async () => {
        if (!notification?.auctionId?._id) {
            showSnackbar("Auction not found for this notification.", "error");
            return;
        }

        try {
            setClaiming(true);
            setMessage("");

            const result = await claimAuctionItem(
                notification.auctionId?._id,
                user.token
            );
            showSnackbar("Item successfully claimed!", "success");
        } catch (err) {
            console.error("Error claiming item:", err);
            showSnackbar("Failed to claim the item:", err, "error");
        } finally {
            setClaiming(false);
        }
    };

    if (!notification) {
        return <FullScreenLoader open={!notification} />;
    }

    return (
        <Box
            sx={{
                minHeight: "95vh",
                backgroundImage: isWinner
                    ? `url(${auction.inventoryId.images[0]})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Stack
                gap={2}
                sx={{
                    p: 3,
                    minHeight: "100%",
                    bgcolor: isWinner && "rgba(0, 0, 0, 0.5)",
                    backdropFilter: isWinner && "blur(10px)",
                }}
            >
                {/*Notification section*/}
                <Stack>
                    <Typography
                        variant="subtitle1"
                        fontWeight={"bold"}
                        color={isWinner ? "white" : "initial"}
                    >
                        {notification.label}
                    </Typography>
                    <Stack>
                        <Typography
                            variant="body2"
                            color={isWinner ? "white" : "secondary"}
                        >
                            {notification.message}
                        </Typography>
                    </Stack>
                </Stack>

                {/*Auction INFORMATION Section*/}
                <SectionWrapper sx={{ gap: 2 }}>
                    {isWinner && (
                        <Stack>
                            <Typography
                                variant="subtitle2"
                                color="secondary"
                                fontWeight={"bold"}
                            >
                                You won the auction!
                            </Typography>
                            <Typography variant="body2" color="gray">
                                You can now proceed to checkout using the button
                                below
                            </Typography>
                        </Stack>
                    )}
                    <Stack gap={2}>
                        <Box sx={{ position: "relative" }}>
                            <img
                                src={auction.inventoryId.images[0]}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    borderRadius: "5px",
                                    height: "100%",
                                    objectFit: "cover",
                                    aspectRatio: "9/12",
                                }}
                            />
                            {isWinner && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        width: "100%",
                                        p: 2,
                                        backdropFilter: "blur(10px)",
                                        bgcolor: "rgba(255, 255, 255, 0.5)",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                    }}
                                >
                                    {timeLeft === "Expired" ? (
                                        <Stack>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                Expired
                                            </Typography>
                                        </Stack>
                                    ) : (
                                        <Stack gap={3}>
                                            <Stack
                                                direction={"row"}
                                                alignItems={"center"}
                                                justifyContent={"space-between"}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={"bold"}
                                                    color="secondary"
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <HourglassIcon />
                                                    Time left:
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="warning"
                                                >
                                                    {timeLeft}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    )}
                                </Box>
                            )}
                        </Box>
                        <Stack gap={4} p={1}>
                            <Stack gap={2}>
                                <Typography variant="subtitle1" color="initial">
                                    {auction.inventoryId?.productName}
                                </Typography>
                                <Stack direction={"row"}>
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        sx={{
                                            border: "1px solid gray",
                                            px: 1,
                                            borderRadius: "999px",
                                        }}
                                    >
                                        {auction.inventoryId?.category?.name}
                                    </Typography>
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ mx: 1 }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        sx={{
                                            border: "1px solid gray",
                                            px: 1,
                                            borderRadius: "999px",
                                        }}
                                    >
                                        {auction.inventoryId?.condition}
                                    </Typography>
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ mx: 1 }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        sx={{
                                            border: "1px solid gray",
                                            px: 1,
                                            borderRadius: "999px",
                                        }}
                                    >
                                        {auction.inventoryId?.isLocal
                                            ? "Large"
                                            : "Small"}{" "}
                                        item
                                    </Typography>
                                </Stack>
                                <Typography variant="subtitle2" color="gray">
                                    {auction.inventoryId?.description}
                                </Typography>

                                <Stack>
                                    <Typography
                                        variant="subtitle2"
                                        color="secondary"
                                    >
                                        Details
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        {auction.inventoryId?.details}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider />
                            <Stack gap={2}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            Start Price:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Php{" "}
                                            {formatNumber(auction.reservePrice)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            Your Bid:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Php {formatNumber(userBid.amount)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            Started At
                                        </Typography>
                                        <Stack>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                {dayjs(
                                                    auction.startTime
                                                ).format("MMMM DD YYYY")}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                {dayjs(
                                                    auction.startTime
                                                ).format("hh:m A")}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            Started At
                                        </Typography>
                                        <Stack>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                {dayjs(
                                                    auction.startTime
                                                ).format("MMMM DD YYYY")}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                {dayjs(
                                                    auction.startTime
                                                ).format("hh:m A")}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>

                            {isWinner && !auction.winnerClaimed && (
                                <Stack>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() =>
                                            navigate(
                                                `/auction-checkout/${auction?._id}/${auction?.winner}`
                                            )
                                        }
                                    >
                                        Proceed to checkout
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </SectionWrapper>
            </Stack>
            <FullScreenLoader open={loading} />
        </Box>
    );
};

export default NotificationContent;
