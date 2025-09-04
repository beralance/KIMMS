import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Dialog, DialogContent, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import auctionProducts from "../../../data/auctionProducts";
import BidDrawer from "./BidDrawer";
import CancelBidDialog from "./CancelBidDialog";

export default function AuctionProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = auctionProducts.find((p) => p.id === parseInt(id));

    const [imageOpen, setImageOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    const [userBid, setUserBid] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [bidStatus, setBidStatus] = useState("none"); // none | submitted | edited
    const [timeLeft, setTimeLeft] = useState(0);

    const increments = [500, 1000, 2000, 3000, 4000, 5000];

    // Timer for auction
    useEffect(() => {
        if (!product) return;
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const start = new Date(product.startTime).getTime();
            const end = start + product.duration;
            const remaining = Math.max(Math.floor((end - now) / 1000), 0);
            setTimeLeft(remaining);
            if (remaining === 0) {
                alert("Auction ended for this product!");
                navigate("/auction");
            }
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [product, navigate]);

    if (!product) return <Typography variant="h5">Product not found</Typography>;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const handleBidConfirm = () => {
        if (currentBid === 0) return alert("Please select an amount to bid.");
        const total = (userBid > 0 ? userBid : product.price) + currentBid;
        setUserBid(total);
        setBidStatus(bidStatus === "none" ? "submitted" : "edited");
        setCurrentBid(0);
        setDrawerOpen(false);
        alert(`Your bid is now PHP ${total}`);
    };

    const handleCancelBid = () => {
        setUserBid(0);
        setCurrentBid(0);
        setBidStatus("edited"); // lock bid
        setDrawerOpen(false);
        alert("Your bid has been canceled. You cannot bid anymore.");
    };

    const totalPrice = userBid + currentBid;
    const isDrawerDisabled = bidStatus === "edited";

    const getActionButtonText = () => {
        switch (bidStatus) {
            case "none":
                return "Bid Now";
            case "submitted":
                return "Edit Bid";
            case "edited":
                return "Bid Locked";
            default:
                return "Bid Now";
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 0, md: 4 }, pb: 10 }}>
            {/* Back button */}
            <Box sx={{ position: "fixed", top: 0, m: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    sx={{ color: "white", borderRadius: "999px" }}
                >
                    <ArrowBackIcon sx={{ fontSize: 25 }} />
                </Button>
            </Box>

            {/* Product Image */}
            <Box sx={{ flex: 1, textAlign: "center", mb: 2 }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ maxWidth: "100%", aspectRatio: "1/1", cursor: "pointer", objectFit: "cover" }}
                    onClick={() => setImageOpen(true)}
                />
                <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="lg">
                    <IconButton
                        onClick={() => setImageOpen(false)}
                        sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ p: 0 }}>
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "auto", objectFit: "contain" }} />
                    </DialogContent>
                </Dialog>
            </Box>

            {/* Product Details */}
            <Container sx={{ flex: { xs: 0, md: 1 } }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h6" color="secondary" gutterBottom>
                        Starting Price: PHP {product.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Status: {product.status.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Condition: {product.condition.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Time Left: {formatTime(timeLeft)}
                    </Typography>
                    {userBid > 0 && (
                        <Typography variant="body1" color="green">
                            Your Bid: PHP {userBid.toLocaleString()}
                        </Typography>
                    )}
                </Box>
                <Typography variant="body1" paragraph>
                    {product.description}
                </Typography>
            </Container>

            {/* Bottom Action */}
            <Box sx={{ position: "fixed", bottom: 0, width: "100%", px: 2, py: 1, bgcolor: "#fff" }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setDrawerOpen(true)}
                    disabled={isDrawerDisabled}
                    sx={{ width: "100%" }}
                >
                    {getActionButtonText()}
                </Button>
            </Box>

            {/* Bid Drawer */}
            <BidDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                increments={increments}
                currentBid={currentBid}
                totalPrice={totalPrice}
                bidStatus={bidStatus}
                onBidIncrement={(val) => setCurrentBid((prev) => prev + val)}
                onResetBid={() => setCurrentBid(0)}
                onConfirmBid={handleBidConfirm}
                onCancelClick={() => setConfirmCancelOpen(true)}
            />

            {/* Cancel Bid Dialog */}
            <CancelBidDialog
                open={confirmCancelOpen}
                onClose={() => setConfirmCancelOpen(false)}
                onConfirm={handleCancelBid}
            />
        </Box>
    );
}
