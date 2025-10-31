import React, { useEffect, useState } from 'react'
import {} from '@mui/icons-material'
import { Box, Button, Stack, Typography, Container, Divider } from '@mui/material'
import AuctionListing from './AuctionListing'
import AuctionHistory from './AuctionHistory'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AuctionHero from './AuctionHero'
import AuctionSection from './AuctionSection'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import axios from 'axios'
import AuctionImages from './components/AuctionImages'

const Auction = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [pendingAuction, setPendingAuction] = useState([]);
    const [auctionHistory, setAuctionHistory] = useState([]);
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auctions/history/past`);
                setAuctionHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch auction history:", err);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auctions`);
                const pendingAuctions = res.data.filter(a => a.status === "PENDING");

                setPendingAuction(pendingAuctions)
            } catch (err) {
                console.error("Failed to fetch auctions:", err);
            }
        };

        fetchAuctions();
        const refreshInterval = setInterval(fetchAuctions, 15000);
        return () => { clearInterval(refreshInterval);}

    }, [pendingAuction.status]);

    const getTimeRemaining = (endTime) => {
        const total = new Date(endTime) - new Date();
        if (total <= 0) return "Auction started";
        const hours = Math.floor(total / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <Box>
            <AuctionHero>
                <Container>
                    <Stack gap={5}>
                        <Stack alignItems={'center'}>
                            <Stack alignItems={'center'}>
                                <img 
                                    src="/kimms-logo.svg"
                                    style={{
                                        display: 'block',
                                        objectFit: 'cover',
                                        height: '40px',
                                        width: '40px',
                                    }}    
                                /> 
                                <Typography variant="h5" color="secondary" align="center">
                                    Welcome to the Auction
                                </Typography>
                            </Stack>
                            <AuctionImages/>
                        </Stack>

                        <Stack>
                            {pendingAuction.length && 
                                <AuctionSection 
                                    auctions={pendingAuction}
                                    label={'Bidding starts soon!'}
                                    subLabel={'Preview of items that will be up for auction soon'}
                                    getTimeRemaining={getTimeRemaining}
                                />
                            }
                        </Stack>
                        {location.pathname === '/auction/listing' ? 
                            <Stack>
                                <AuctionSection 
                                    auctions={auctionHistory}
                                    label={'Check auction history'}
                                    onClick={() => navigate('/auction/history')}
                                />
                            </Stack>
                            :
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Typography variant="subtitle2" color="initial">
                                    View Listing 
                                </Typography>
                                <Button onClick={() => navigate('/auction/listing')}>
                                    <ChevronRightIcon/>
                                </Button>
                            </Stack>
                        }
                        {/*MAIN content*/}
                        <Box>
                            <Divider sx={{my: 1}}>
                                <Typography variant="body2" color="gray">
                                    On-Going
                                </Typography>
                            </Divider>
                        </Box>
                        <Stack>
                            <Outlet/>
                        </Stack>
                    </Stack>
                </Container>
            </AuctionHero>
        </Box>
    )
}

export default Auction
