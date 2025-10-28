import React, { useEffect, useState } from 'react'
import { Box, Stack, Typography, Container } from '@mui/material'
import axios from "axios";
import {Swiper, SwiperSlide} from 'swiper/react'
import {EffectCoverflow, Pagination} from 'swiper/modules'

import {Grid } from 'lucide-react';

const AuctionHistoryPreview = () => {
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
        <Stack direction={'row'} gap={2} sx={{overflowX: 'auto', scrollBehavior: 'smooth', bgcolor: '#f0f0f0', borderRadius: 1, p: 1}}>
            {auctions.slice(0, 5).map((auction) => (
                <Stack key={auction._id} bgcolor={'white'} sx={{p: 1, borderRadius: 1, boxShadow: 2}}>
                    <Box sx={{width: 150, height: 200}}>
                        <img 
                            src={auction.inventoryId?.images[0]} 
                            style={{
                                width: '100%', 
                                height: '100%', 
                                display: 'block', 
                                objectFit: 'cover',
                                borderRadius: '2px',
                            }}
                        />
                    </Box>
                    <Stack sx={{my: 1}}>
                        <Box sx={{overflow: 'hidden', maxWidth: '100%'}}>
                            <Typography variant="body2" align='center' noWrap color="secondary" sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{auction.inventoryId?.productName}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" align='center' color="gray">{auction.inventoryId?.condition}</Typography>
                        </Box>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    )
}

export default AuctionHistoryPreview
