import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import axios from "axios";

const AuctionHistory = () => {
    const [auctions, setAuctions] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auctions/history/past`);
                setAuctions(res.data);
            } catch (err) {
                console.error("Failed to fetch auction history:", err);
            }
        };

        fetchHistory();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Past Auctions
            </Typography>
            <Grid container spacing={2}>
                {auctions.map((auction) => (
                    <Grid item xs={12} md={6} key={auction._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {auction.inventoryId?.name || "Unnamed Item"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {auction.inventoryId?.description || "No description"}
                                </Typography>
                                <Typography>Winner: {auction.winner || "No winner"}</Typography>
                                <Typography>Top Bidders:</Typography>
                                {auction.topBidders?.length > 0 ? (
                                    auction.topBidders.map((bid, idx) => (
                                        <Typography key={idx}>
                                            {idx + 1}. {bid.userId?.name} - ₱{bid.amount}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography>No bids</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AuctionHistory;
