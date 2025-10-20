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
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                loop={true}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: true,
                }}
                style={{
                    paddingBlock: '.5rem',
                    paddingInline: '1.5rem',
                }}
                modules={[EffectCoverflow]}
                className="mySwiper"
            >     
                {auctions.slice(0, 5).map((auction) => (
                    <SwiperSlide key={auction._id}>
                        <Stack bgcolor={'white'} sx={{p: 1, borderRadius: 1, boxShadow: 2}}>
                            <Box sx={{height: 360}}>
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
                    </SwiperSlide>
                ))}
            </Swiper>
        </Stack>

    )
}

export default AuctionHistoryPreview
