import React, { useEffect, useState } from "react";
import { Box, Container, Card, CardContent, Typography, Button, Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import AuctionPreviewCard from "./components/AuctionPreviewCard";

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

    }, [auctions.status]);

    const getTimeRemaining = (endTime) => {
        const total = new Date(endTime) - new Date();
        if (total <= 0) return "Auction ended";
        const hours = Math.floor(total / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <Container>
            <Stack gap={2}>
                <Stack>
                    <Typography variant="subtitle1" align="center">
                        Live Auctions
                    </Typography>
                    <Typography variant="body2" align="center">
                        Experience live bidding and win your next deal.
                    </Typography>
                </Stack>
                <Grid container spacing={4}>
                    {auctions.map((auction) => (
                        <Grid item xs={12} sm={6} md={4} key={auction._id}>
                            <AuctionPreviewCard product={auction} getTimeRemaining={getTimeRemaining}/>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Container>
    );
};

export default AuctionListing;
