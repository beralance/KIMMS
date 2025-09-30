import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const AuctionListing = () => {
    const [auctions, setAuctions] = useState([]);
    const [tick, setTick] = useState(0)
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auctions`);
                // Only LIVE auctions
                const liveAuctions = res.data.filter(a => a.status === "LIVE");
                setAuctions(liveAuctions);
            } catch (err) {
                console.error("Failed to fetch auctions:", err);
            }
        };

        fetchAuctions();
        const refreshInterval = setInterval(fetchAuctions, 30000); // refresh every 30s
        const tickInterval = setInterval(() => setTick(t => t + 1), 1000); // refresh every 30s
        return () => {
            clearInterval(refreshInterval);
            clearInterval(tickInterval)
        }

    }, []);

    const getTimeRemaining = (endTime) => {
        const total = new Date(endTime) - new Date();
        if (total <= 0) return "Auction ended";
        const hours = Math.floor(total / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Live Auctions
            </Typography>
            <Grid container spacing={2}>
                {auctions.map((auction) => (
                    <Grid item xs={12} sm={6} md={4} key={auction._id}>
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
                                <Typography variant="h6">{auction.inventoryId?.productName || "Unnamed Item"}</Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {auction.inventoryId?.description || auction.description || "No description"}
                                </Typography>
                                <Typography variant="body1">
                                    Current Bid: ₱{auction.reservePrice} {/* replace with top bid if needed */}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Ends in: {getTimeRemaining(auction.endTime)}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/auction/bid/${auction._id}`} 
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    Place Bid
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AuctionListing;
