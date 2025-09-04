// pages/Auction.jsx
import { Box, Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AuctionPreviewCard from './AuctionPreviewCard';
import auctionProductsData from '../../../data/auctionProducts';
import { useNavigate } from 'react-router-dom';
import AutoSlideCarousel from '../../../components/AutoSlideCarousel';

const Auction = () => {
    const navigate = useNavigate();
    const [auctionProducts, setAuctionProducts] = useState(auctionProductsData);

    // Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            setAuctionProducts(prev => 
                prev.filter(product => {
                    const endTime = product.startTime.getTime() + product.duration;
                    const buffer = product.duration * 0.05; // 5% buffer
                    if (now > endTime + buffer) {
                        // Auction ended, remove product
                        return false;
                    }
                    return true;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <AutoSlideCarousel/>
            <Container>
                <Typography variant="h5" component='h1' color="initial" sx={{mb: 3, textAlign: 'center'}}>
                    Explore our auction items and enjoy your bidding experience.
                </Typography>
                <Grid container spacing={4}>
                    {auctionProducts.map((item) => {
                        // Compute remaining time
                        const now = new Date().getTime();
                        const endTime = item.startTime.getTime() + item.duration;
                        const remainingTime = Math.max(0, endTime - now);

                        return (
                        <Grid size={{xs: 12, sm: 6, md: 4}}  key={item.id} sx={{px: 2}}>
                            <AuctionPreviewCard 
                            product={{...item, remainingTime}}
                            onNavigate={() => navigate(`/auction/${item.id}`)}
                            />
                        </Grid>
                        );
                    })}
                    {auctionProducts.length === 0 && (
                        <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>
                            No active auctions at the moment.
                        </Typography>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default Auction;
