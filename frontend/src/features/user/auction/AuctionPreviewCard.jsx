import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Badge } from '@mui/material';

export default function AuctionPreviewCard({ product = {}, onNavigate }) {
    const { name = 'Unknown', price = 0, image, condition = 'new', status, remainingTime = 0 } = product;
    const [timeLeft, setTimeLeft] = useState(remainingTime);

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const auctionEnded = timeLeft <= 0;

    return (
        <Card sx={{ width: '100%', height: '100%', display: 'flex', borderRadius: 2, flexDirection: 'column', boxShadow: 'none' }}>
            <Box sx={{ cursor: onNavigate && !auctionEnded ? 'pointer' : 'default' }}>
                {/* Name & Badge */}
                <CardContent sx={{ bgcolor: '#37353E', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="white" noWrap sx={{ fontWeight: 600 }}>
                        {name}
                    </Typography>
                    {/* Countdown Timer */}
                    <Typography variant="body2" fontSize='medium' color={auctionEnded ? 'error' : 'white'}>
                        {auctionEnded ? 'Auction Ended' : formatTime(timeLeft)}
                    </Typography>
                </CardContent>

                {/* Product Image */}
                <CardMedia
                    component="img"
                    image={image}
                    alt={name}
                    sx={{ aspectRatio: '1/1', objectFit: 'cover' }}
                />

                {/* Card Body */}
                <CardContent sx={{ px: 3, py: 2, bgcolor: '#37353E' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{display: 'flex', justifyContent: 'center', gap: 1}}>
                            <Typography variant="body1" color="white" sx={{ fontWeight: "bold" }}>
                                PHP {price.toLocaleString()}
                            </Typography>
                             <Typography variant="body1" color="white" sx={{ bgcolor: 'skyblue', fontWeight: 'bold', px: 2, borderRadius: 2 }}>
                                {condition.toUpperCase()}
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                            {status.toUpperCase()}...
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            py: 1,
                            width: '100%',
                            bgcolor: auctionEnded ? '#888' : '#f0f0f0',
                            color: auctionEnded ? '#ccc' : 'black',
                            fontWeight: 'bold',
                        }}
                        onClick={!auctionEnded && onNavigate ? onNavigate : undefined}
                        disabled={auctionEnded}
                    >
                        See more
                    </Button>
                </CardContent>
            </Box>
        </Card>
    );
}
