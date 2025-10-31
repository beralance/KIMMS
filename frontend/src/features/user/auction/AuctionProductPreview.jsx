import React, {useEffect, useState} from 'react'
import { ArrowBackRounded, Swipe } from '@mui/icons-material'
import { Box, Button, Divider, Fade, Grid, Grow, Stack, Typography } from '@mui/material'
import { ScrollOnTop } from '../../../utils/ScrollOnTop'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSnackbar } from '../../../contexts/SnackbarContext'
import RequirementDrawer from './components/RequirementDrawer'
import {Swiper, SwiperSlide} from 'swiper/react'
import {EffectFade, Autoplay, Navigation, Pagination} from 'swiper/modules'
import {ScrollSectionLeft, ScrollSectionRight} from '../../../components/SectionTransitionX'
import ScrollSection from '../../../components/SectionTransition'
import { formatNumber } from '../../../utils/stringUtils'

const AuctionProductPreview = () => {
    const [auction, setAuctions] = useState([]);
    const [isLive, setIsLive] = useState(true)
    const [tick, setTick] = useState(0)
    const API_URL = import.meta.env.VITE_API_URL;
    const {id} = useParams()
    const {showSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [openRequirement, setOpenRequirement] = useState(false)

    ScrollOnTop()

    
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auctions/${id}`);
                // Only LIVE auctions
                const liveAuctions = res.data
                if (liveAuctions.status !== 'LIVE') {
                    showSnackbar('Bidding for this product is closed')
                    navigate('/auction/listing')
                    setIsLive(false)
                    return
                }
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

    const gridContent = [
        {key: 0,  label: 'Category', content: `${auction.inventoryId?.category?.name}`, img: '/category-list.svg'},
        {key: 1,  label: 'Condition', content: `${auction.inventoryId?.condition}`, img: '/loupe-heart.svg'},
        {key: 2,  label: 'Status', content: `${auction.status}`, img: '/record-982.svg'},
        {key: 3,  label: 'Time left', content: `${getTimeRemaining(auction.endTime)}`, img: '/time-quarter.svg'},
    ]

    return (
        <Box>
        {/* Add backend, dont show this page or redirect to product details if user already bids on this product*/}
            <Box 
                sx={{
                    backgroundImage: 'url(/view-photo-frame-with-interior-home-decor.jpg)',
                    backgroundPosition: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundOrigin: 'center',
                    position: 'fixed',
                    backgroundSize: '100%',
                    height: '100vh',
                    zIndex: -1,
                    top: 0, bottom: 0, left: 0, right: 0,
                }}
            />
                <Box sx={{ position: 'fixed', top: 14, left: 28, zIndex: 1000}}>
                    <Button variant="contained" color='secondary' onClick={() => navigate('/auction/listing')} sx={{ color: 'white', borderRadius: '999px' }}>
                        <ArrowBackRounded sx={{ fontSize: 25}} />
                    </Button>
                </Box>
            {isLive ? (
                <Stack alignItems={'center'} justifyContent={'center'} sx={{p: 3, bgcolor: 'rgba(0, 0, 0, 0.7)', pt: 6, backdropFilter: 'blur(3px)'}}>
                    <Stack alignItems={'center'} sx={{pb: 2}}>
                        <Typography variant='h6' fontWeight={'bold'} color='white'>
                            Join to place your bid
                        </Typography>
                        <Typography variant='body2' gutterBottom color='white'>
                        Time is limited, don't miss your chance to bid.
                        </Typography>
                    </Stack>
                    <Stack gap={2} sx={{mb: 4}}>
                        {/* Image*/}
                            <Swiper
                                spaceBetween={30}
                                effect='fade'
                                navigation={true}
                                autoplay={{
                                    delay: 1000,
                                }}
                                className='swipe'
                                style={{
                                    background: 'white',
                                    borderRadius: '5px',
                                    width: '350px', 
                                    boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.2)',
                                    '--swiper-navigation-color': '#333333ff',
                                    '--swiper-navigation-size': '1.8rem',
                                }}
                                modules={[EffectFade, Autoplay, Pagination, Navigation]}
                            >
                                {auction.inventoryId?.images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <Fade in={true} mountOnEnter unmountOnExit timeout={1000}>
                                            <img
                                                src={image} 
                                                style={{
                                                    width: '100%',
                                                    display: 'block',
                                                    height: '100%',
                                                    borderRadius: 5,
                                                    objectFit: 'cover',
                                                    aspectRatio: '9/12',
                                                    
                                                }}
                                            />
                                        </Fade>
                                    </SwiperSlide>
                                ))}
                                <Typography 
                                    variant="body1" 
                                    color="white"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        zIndex: 1,
                                        px: 2,
                                        borderRadius: '999px',
                                        m: 2,
                                        bgcolor: '#ff1a2dff',
                                        boxShadow: 5,
                                    }}
                                >
                                    {auction.status}
                                </Typography>

                                <Stack direction={'row'} alignItems={'center'} gap={1} sx={{position: 'absolute', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', zIndex: 1, bottom: 0, left: 0, px: 4, py: 1, m: 2, bgcolor: '#f8f8f8', borderRadius: '999px'}}>
                                    <Typography 
                                        variant="subtitle2" 
                                        color="secondary"
                                        fontWeight={'bold'}
                                    >
                                        PHP {formatNumber(auction.reservePrice)}
                                    </Typography>
                                </Stack>
                            </Swiper>
                        <Box sx={{p: 1}}>
                            <Stack sx={{mb: 2}}>
                                <Typography variant="h6" color="white" fontWeight={'bold'}>
                                    {auction.inventoryId?.productName}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="white" gutterBottom>{auction.description}</Typography>
                        </Box>
                        <Box sx={{position: 'sticky', top: 10, mb: 3, zIndex: 10, borderRadius: '999px', overflow: 'hidden', boxShadow: '0px 0px 20px rgba(216, 216, 216, 0.5)'}}>
                            <Button variant='text' fullWidth  onClick={() => setOpenRequirement(true)} sx={{fontWeight: 'bold',  bgcolor: 'white', py: 1, color: '#37353E', border: '2px solid white', }}>
                                START BIDDING
                            </Button>
                        </Box>
                        {/* Product Info */}
                        <Stack sx={{borderRadius: 2}}>
                            <Typography variant="body1" fontWeight={'bold'} color="white" gutterBottom>Quick Overview</Typography>
                            <Grid container spacing={.5}>
                                {gridContent.map((item) => (
                                    <Grid size={{xs: 6}} key={item.key}>
                                        <Stack direction={'row'}  gap={2} alignItems={'center'} sx={{bgcolor: 'rgba(255, 255, 255, .1)', width: '100%', boxShadow: 5, p: 1.5, py: 2, borderRadius: 1}}>
                                            <ScrollSectionRight>
                                                <Box>
                                                    <img src={item.img} alt={item.label} style={{width: 30, filter: 'invert(1)'}}/>
                                                </Box>
                                            </ScrollSectionRight>
                                            <Stack>
                                                <Typography variant="body1" fontWeight={'bold'} color="white">{item.label}</Typography>
                                                <Typography variant="body2" noWrap color="rgba(255, 255, 255, 0.8)">{item.content}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>

                        <Stack sx={{borderRadius: 2}}>
                            <Typography variant="body1" fontWeight={'bold'} gutterBottom color="white">More Details</Typography>
                            <Stack gap={1}>
                                <ScrollSectionRight>
                                <Stack sx={{bgcolor: 'rgba(255, 255, 255, 0.1)', width: '100%', boxShadow: 5, p: 2, borderRadius: 2}}>
                                    <Typography variant="body2" color="white">
                                        {auction.inventoryId?.description}
                                    </Typography>
                                </Stack>
                                </ScrollSectionRight>
                                <ScrollSectionRight>
                                    <Stack sx={{bgcolor: 'rgba(255, 255, 255, 0.1)', width: '100%', boxShadow: 5, p: 2, borderRadius: 2}}>
                                        <Typography variant="body2" color="white">
                                            {auction.inventoryId?.details}
                                        </Typography>
                                    </Stack>
                                </ScrollSectionRight>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                )
                :
                (
                    <>
                        <Box>
                            <Typography>
                                This auction has ended
                            </Typography>
                        </Box>
                    </>
                )
            }
            <RequirementDrawer 
                productId={id} 
                productName={auction.inventoryId?.productName}
                open={openRequirement} 
                anchor='bottom' 
                onClose={() => setOpenRequirement(false)}
                sx={{
                    borderRadius: 20,
                    bgColor: 'yellow',
                }}
            />
        </Box>
    )
}

export default AuctionProductPreview
