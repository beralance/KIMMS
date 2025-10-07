import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Fade, Grid, Stack } from "@mui/material";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { ScrollSectionLeft, ScrollSectionRight } from "../../../components/SectionTransitionX";

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
                History Gallery
            </Typography>
            <Grid container spacing={2}>
                {auctions.map((auction) => (
                    <Grid size={{xs: 12, sm: 6}} key={auction._id}>
                        <Stack sx={{position: 'relative',  border: '1px solid rgba(0, 0, 0, .4)', borderRadius: 2, overflow: 'hidden'}}>
                            {/*
                            <Stack direction={'row'}>
                                <Stack>
                                    <Typography variant="h6">
                                        {auction.inventoryId?.productName || "Unnamed Item"}
                                    </Typography>
                                    <Typography variant="h6">
                                        {auction.status}
                                    </Typography>
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
                                </Stack>
                            </Stack>
                                */}
                            <Box
                                sx={{
                                    background: "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                                    width: '100%',
                                    position: 'absolute',
                                    height: '100%',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    zIndex: 1000,
                                }}
                            >
                                <Stack sx={{m: 4}} gap={1}>
                                    <Stack>
                                        <Typography variant="h6">
                                            {auction.inventoryId?.productName || "Unnamed Item"}
                                        </Typography>
                                        <Typography variant="body1">
                                            Php {auction.reservePrice}
                                        </Typography>
                                    </Stack>
                                    <Stack>
                                        <Typography variant="h6">
                                            {auction.status}
                                        </Typography>
                                        <Typography variant="subtitle2" color="grey">
                                            {`${auction.inventoryId?.category?.name} | ${auction.inventoryId?.condition}`}
                                        </Typography>
                                        <Typography variant="subtitle2" color="grey" sx={{ maxWidth: '70%'}}>
                                            {auction.inventoryId?.description}
                                        </Typography>
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
                                    </Stack>
                                </Stack>
                            </Box>

                            <Stack>
                                <Box>
                                    <Swiper
                                        modules={[Autoplay, Navigation, Pagination, EffectFade]}
                                        spaceBetween={0}
                                        autoplay={{
                                            delay: 3000,
                                            disableOnInteraction: false,
                                            reverseDirection: true
                                        }}
                                        onSwiper={(swiper) => {setTimeout(() => swiper.update(), 100)}}
                                        speed={2000}
                                        loop={true}
                                        style={{
                                            width: '100%'
                                        }}
                                    >
                                        {auction.inventoryId?.images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    src={image} 
                                                    style={{
                                                        width: '100%',
                                                        display: 'block',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        aspectRatio: '9/12',
                                                        
                                                    }}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AuctionHistory;
