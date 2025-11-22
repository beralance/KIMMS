import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Stack,
    Container,
    Divider,
    Grid,
    IconButton,
    Collapse,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import SectionWrapper from "../../../components/SectionWrapper";
import ConfirmDialog from "../../../components/ConfirmDialog";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { formatNumber } from "../../../utils/stringUtils";
import { getBidders, cancelBid } from "../../../utils/bidApi";

import dayjs from "dayjs";
import {
    ChevronRightIcon,
    EditIcon,
    UsersRoundIcon,
    XIcon,
} from "lucide-react";

const AuctionProductDetails = () => {
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [auction, setAuction] = useState(null);
    const [highestBid, setHighestBid] = useState(0);
    const [allBidders, setAllBidders] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [userBidData, setUserBidData] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [message, setMessage] = useState("");
    const [timeRemaining, setTimeRemaining] = useState("");
    const { user } = useAuth();
    const token = user.token;
    const [cancelOpen, setCancelOpen] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleCancelOpen = () => setConfirmCancel(true);
    const handleCancelClose = () => setConfirmCancel(false);

    // Fetch auction and current highest bid
    const fetchAuction = async () => {
        try {
            const auctionRes = await axios.get(`${API_URL}/api/auctions/${id}`);

            const bidRes = await axios.get(`${API_URL}/api/bids/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setAuction(auctionRes.data);

            const topBid =
                bidRes.data.length > 0
                    ? bidRes.data[0].amount
                    : auctionRes.data.startPrice;
            setHighestBid(topBid);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAuction();
        const interval = setInterval(fetchAuction, 15000); // poll every 15s
        return () => clearInterval(interval);
    }, [id, token]);

    // Timer for countdown
    useEffect(() => {
        const timer = setInterval(() => {
            if (auction) {
                const total = new Date(auction.endTime) - new Date();
                if (total <= 0) {
                    setTimeRemaining("Auction ended");
                    clearInterval(timer);
                } else {
                    const hours = Math.floor(total / (1000 * 60 * 60));
                    const minutes = Math.floor(
                        (total % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    const seconds = Math.floor((total % (1000 * 60)) / 1000);
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [auction]);

    useEffect(() => {
        if (!auction?._id || !token) return;
        const getAllBidders = async () => {
            try {
                const data = await getBidders(auction._id, token);
                console.log("test", data);
                const activeCount = data.filter(
                    (b) => b.status === "ACTIVE"
                ).length;
                setAllBidders(activeCount);

                const userBid = data.find(
                    (bid) => bid.userId?._id === user.userId
                );
                console.log("Bidders data", userBid);

                setCurrentBid(userBid ? userBid.amount : 0);
                setUserBidData(userBid);
                console.log("Bidders data", data);
            } catch (err) {
                console.error("Error getting bidders", err);
                showSnackbar("Error getting bidders", "error");
            }
        };
        getAllBidders();
    }, [auction, token, user.userId]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();

        if (!bidAmount) {
            showSnackbar("Please place your bid", "warning");
            return;
        }
        if (!auction || auction.status !== "LIVE") {
            showSnackbar("Auction is not active", "warning");
            navigate("/auction/listing");
            return;
        }

        const minAllowed = highestBid + auction.minIncrement;
        if (!bidAmount || Number(bidAmount) < minAllowed) {
            showSnackbar(
                `Bid must be at least Php${formatNumber(minAllowed)}`,
                "warning"
            );
            return;
        }

        try {
            await axios.post(
                `${API_URL}/api/bids`,
                { auctionId: id, amount: Number(bidAmount) },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage("Bid placed successfully!");
            showSnackbar("Your bid has been placed!", "success");
            setBidAmount("");
            fetchAuction();
        } catch (err) {
            console.error(err);
            showSnackbar(
                err.response?.data?.message || "Failed to place bid",
                "warning"
            );
        }
    };

    const handleCancelBid = async () => {
        if (!auction || !token) return;

        try {
            const res = await cancelBid(auction._id, token);
            showSnackbar(res.message, "success");
            setCurrentBid(0);
            fetchAuction();
            handleCancelClose();
        } catch (err) {
            showSnackbar(
                err.response?.data?.message || "Failed to cancel bid",
                "error"
            );
        }
    };

    if (!auction) return <FullScreenLoader />;
    if (auction.status !== "LIVE") {
        showSnackbar("Auction Ended", "warning");
        navigate("/auction/listing");
        return;
    }

    console.log("auction", allBidders);
    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Stack>
                <Stack>
                    <Box sx={{ position: "relative" }}>
                        <img
                            src={`${auction.inventoryId?.images[0]}`}
                            alt={auction.inventoryId?.productName}
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                display: "block",
                                aspectRatio: "1/1",
                            }}
                        />
                        <Stack
                            sx={{
                                position: "absolute",
                                bottom: 10,
                                right: 10,
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="white"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 2,
                                    px: 5,
                                    bgcolor: "rgba(0, 0, 0, 0.5)",
                                    backdropFilter: "blur(10px)",
                                    gap: 1,
                                }}
                            >
                                <UsersRoundIcon style={{ color: "white" }} />
                                {allBidders}
                            </Typography>
                        </Stack>
                    </Box>
                    <Container sx={{ bgcolor: "#f0f0f0", pt: 2, pb: 5 }}>
                        <Stack gap={2}>
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <Stack
                                    sx={{ minWidth: "80%" }}
                                    direction={"row"}
                                    gap={2}
                                    alignItems={"center"}
                                >
                                    <Box
                                        sx={{
                                            height: 40,
                                            width: 5,
                                            bgcolor: "secondary.main",
                                        }}
                                    />
                                    <Typography variant="h5">
                                        {auction.inventoryId?.productName ||
                                            "Unnamed Item"}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider />
                            <Stack gap={3}>
                                <Box>
                                    <form onSubmit={handleBidSubmit}>
                                        <SectionWrapper sx={{ gap: 2 }}>
                                            {!currentBid ||
                                            userBidData?.canCancel === true ? (
                                                <>
                                                    <Stack>
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="secondary"
                                                        >
                                                            Place Bid
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="gray"
                                                        >
                                                            Submit your offer
                                                            for this auction
                                                        </Typography>
                                                    </Stack>
                                                    <Stack
                                                        direction={
                                                            userBidData?.canEdit ===
                                                                true &&
                                                            currentBid
                                                                ? "column"
                                                                : "row"
                                                        }
                                                        gap={2}
                                                    >
                                                        <TextField
                                                            label={
                                                                currentBid
                                                                    ? `Your Bid: Php ${formatNumber(
                                                                          currentBid
                                                                      )}`
                                                                    : "Add amount"
                                                            }
                                                            type="number"
                                                            disabled={
                                                                currentBid >
                                                                    0 &&
                                                                !userBidData?.canEdit
                                                            }
                                                            value={bidAmount}
                                                            onChange={(e) =>
                                                                setBidAmount(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            fullWidth
                                                            margin="normal"
                                                            sx={{
                                                                bgcolor:
                                                                    "white",
                                                                m: 0,
                                                            }}
                                                            required={
                                                                !currentBid
                                                            }
                                                        />
                                                        <Button
                                                            sx={{
                                                                width:
                                                                    userBidData?.canEdit ===
                                                                        true &&
                                                                    currentBid
                                                                        ? "100%"
                                                                        : "30%",
                                                            }}
                                                            disabled={
                                                                currentBid >
                                                                    0 &&
                                                                !userBidData?.canEdit
                                                            }
                                                            type="submit"
                                                            variant={
                                                                currentBid >
                                                                    0 &&
                                                                !userBidData?.canEdit
                                                                    ? "contained"
                                                                    : "outlined"
                                                            }
                                                            color="secondary"
                                                        >
                                                            {!currentBid ||
                                                            !userBidData?.canEdit
                                                                ? "Bid"
                                                                : "Submit Another Bid"}
                                                        </Button>
                                                    </Stack>
                                                </>
                                            ) : (
                                                <>
                                                    <Stack>
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="secondary"
                                                        >
                                                            No More Bid Allowed
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="warning"
                                                        >
                                                            You recently
                                                            cancelled this
                                                            auction, you cannot
                                                            bid anymore.
                                                        </Typography>
                                                    </Stack>
                                                </>
                                            )}
                                            {userBidData?.canEdit === true &&
                                                currentBid && (
                                                    <Stack
                                                        sx={{
                                                            bgcolor: "#f0f0f0",
                                                            p: 1,
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        {userBidData?.canEdit ===
                                                        false ? (
                                                            <Typography>
                                                                You already
                                                                place a new bid.
                                                                You cannot
                                                                submit anymore
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                color="gray"
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontWeight:
                                                                            "bold",
                                                                    }}
                                                                >
                                                                    Note:
                                                                </span>{" "}
                                                                You only have a{" "}
                                                                <b>single</b>{" "}
                                                                chance to change
                                                                your bid. Once
                                                                changed you
                                                                cannot place
                                                                another bid.
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                )}
                                            {userBidData?.canCancel === true &&
                                                currentBid > 0 && (
                                                    <Stack gap={1}>
                                                        <Stack
                                                            direction={"row"}
                                                            gap={1}
                                                            justifyContent={
                                                                "space-between"
                                                            }
                                                            alignItems={
                                                                "center"
                                                            }
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="gray"
                                                            >
                                                                Cancel bid?
                                                            </Typography>
                                                            <IconButton
                                                                onClick={() =>
                                                                    setCancelOpen(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            !prev
                                                                    )
                                                                }
                                                            >
                                                                {cancelOpen ? (
                                                                    <XIcon color="red" />
                                                                ) : (
                                                                    <ChevronRightIcon />
                                                                )}
                                                            </IconButton>
                                                        </Stack>
                                                        <Collapse
                                                            in={cancelOpen}
                                                            mountOnEnter
                                                            unmountOnExit
                                                        >
                                                            <Button
                                                                variant="outlined"
                                                                color="warning"
                                                                fullWidth
                                                                onClick={() =>
                                                                    handleCancelOpen()
                                                                }
                                                            >
                                                                Cancel Bid
                                                            </Button>
                                                        </Collapse>
                                                    </Stack>
                                                )}
                                        </SectionWrapper>
                                    </form>
                                </Box>
                                <SectionWrapper sx={{ gap: 2 }}>
                                    <Stack>
                                        <Typography
                                            variant="body1"
                                            color="secondary"
                                        >
                                            Auction Overview
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Overview of auction timeline and
                                            pricing
                                        </Typography>
                                    </Stack>
                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 6 }}>
                                            <Stack
                                                sx={{ p: 1, borderRadius: 1 }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    Starting Price
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    Php{" "}
                                                    {formatNumber(
                                                        auction.reservePrice
                                                    )}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Stack
                                                sx={{ p: 1, borderRadius: 1 }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    Current Bid
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    {userBidData?.status ===
                                                    "CANCELLED"
                                                        ? userBidData?.status
                                                        : `Php ${formatNumber(
                                                              currentBid
                                                          )}`}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Stack
                                                sx={{ p: 1, borderRadius: 1 }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    Started At
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    {dayjs(
                                                        auction.createdAt
                                                    ).format("MMMM DD YYYY")}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Stack
                                                sx={{ p: 1, borderRadius: 1 }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    Time Remaining
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    {timeRemaining}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </SectionWrapper>
                            </Stack>
                        </Stack>
                    </Container>
                </Stack>
            </Stack>
            <ConfirmDialog
                open={confirmCancel}
                title="Cancel your bid?"
                content="Are you sure you want to cancel your bid? You cannot participate or place a bid in this auction anymore."
                onConfirm={handleCancelBid}
                onCancel={handleCancelClose}
                confirmText="Yes. Cancel Bid"
                cancelText="Don't Cancel"
                color="error"
            />
        </Box>
    );
};

export default AuctionProductDetails;
