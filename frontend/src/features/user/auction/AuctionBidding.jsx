import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const AuctionBiddingPage = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [highestBid, setHighestBid] = useState(0);
    const [bidAmount, setBidAmount] = useState("");
    const [message, setMessage] = useState("");
    const [timeRemaining, setTimeRemaining] = useState("");
    const { token } = useAuth()
    const API_URL = import.meta.env.VITE_API_URL;
    // Fetch auction and current highest bid
    const fetchAuction = async () => {
        try {
            const auctionRes = await axios.get(`${API_URL}/api/auctions/${id}`);
            console.log('!!!!THIS IS THE AUCITON RES', auctionRes)
            console.log('@@@@THIS IS THE ID', id)
            console.log('@@@@THIS IS THE DATA INVENTORY', auctionRes.data)

            const bidRes = await axios.get(`${API_URL}/api/bids/${id}`, {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log('####THIS IS THE BID RES', bidRes)
            setAuction(auctionRes.data);
            console.log('#########################', auction)


            const topBid = bidRes.data.length > 0 ? bidRes.data[0].amount : auctionRes.data.startPrice;
            setHighestBid(topBid);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAuction();
        const interval = setInterval(fetchAuction, 15000); // poll every 15s
        return () => clearInterval(interval);
    }, [id]);

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
                    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((total % (1000 * 60)) / 1000);
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [auction]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!auction || auction.status !== "LIVE") {
            setMessage("Auction is not active");
            return;
        }

        const minAllowed = highestBid + auction.minIncrement;
        if (!bidAmount || Number(bidAmount) < minAllowed) {
            setMessage(`Bid must be at least ₱${minAllowed}`);
            return;
        }

        
        try {
            await axios.post(
                `${API_URL}/api/bids`,
                { auctionId: id, amount: Number(bidAmount) },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage("Bid placed successfully!");
            setBidAmount("");
            fetchAuction(); // refresh highest bid
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to place bid");
        }
    };

    if (!auction) return <Typography>Loading auction...</Typography>;
    

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
            <Card>
                <CardContent>
                    <Box>
                        <img 
                            src={`${auction.inventoryId?.image}`} 
                            alt={auction.inventoryId?.productName}
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                aspectRatio: '1/1'
                            }}    
                        />
                    </Box>
                    <Typography variant="h5">{auction.inventoryId?.productName || "Unnamed Item"}</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        {auction.description || auction.inventoryId?.description || "No description"}
                    </Typography>
                    <Typography variant="body1">Current Bid: ₱{highestBid}</Typography> {/* change highest bid to user bid*/}
                    <Typography variant="body2" color="textSecondary">
                        Time Remaining: {timeRemaining}
                    </Typography>

                    <form onSubmit={handleBidSubmit} style={{ marginTop: 16 }}>
                        <TextField
                            label="Your Bid"
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Place Bid
                        </Button>
                    </form>

                    {message && (
                        <Typography sx={{ mt: 2 }} color={message.includes("success") ? "green" : "red"}>
                            {message}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AuctionBiddingPage;
