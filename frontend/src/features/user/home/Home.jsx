import React, { useEffect, useRef, useState } from 'react'
import AutoSlideCarousel from '../../../components/AutoSlideCarousel'
import FeaturedProductCarousel from '../../../components/FeaturedProductCarousel'
import { Box, Button, Container, Divider, Fade, Slide, Stack, Typography, Grid} from '@mui/material'
import SectionTransition from '../../../components/SectionTransition'
import {ScrollSectionRight} from '../../../components/SectionTransitionX'
import { LocalOfferRounded, ShoppingBagRounded, TagRounded } from '@mui/icons-material'
import HomeHero from './HomeHero'
import HomeAuctionSection from './HomeAuctionSection'
import { ScrollOnTop } from '../../../utils/ScrollOnTop'
import { fetchAuctions } from '../../../utils/auctionApi'
import { useAuth } from '../../../contexts/AuthContext'
import CategoriesList from './CategoriesList'
import NewArrival from './NewArrival'
import { useNavigate } from 'react-router-dom'
import AuctionLiveDisplayer from './components/AuctionLiveDisplayer'
import AuctionPendingDisplayer from './components/AuctionPendingDisplayer'

export default function Home () {
    const {user} = useAuth()
    const [auctions, setAuctions] = useState(null)
    const [pendingAuctions, setPendingAuctions] = useState([])
    const [liveAuctions, setLiveAuctions] = useState([])

    const navigate = useNavigate()
    ScrollOnTop()

    useEffect(() => {
        const getAuction = async () => {
            const data = await fetchAuctions()
            setAuctions(data)

            const liveAuctionsData = data.filter((l) => l.status === 'LIVE')
            const pendingAuctionsData = data.filter((p) => p.status === 'PENDING')

            console.log('LIVE AUCTIONS', liveAuctionsData)
            console.log('PENDING AUCTIONS', pendingAuctionsData)

            setLiveAuctions(liveAuctionsData)
            setPendingAuctions(pendingAuctionsData)
        }
        getAuction()
    }, [])


    return (
        <Box>
            <HomeHero/>
            <Box sx={{bgcolor: 'white', py: 5, pb: 20}}>
                <Container >
                    <Stack spacing={20}>
                        <section>
                            <Stack gap={5}justifyContent={'center'}>
                                <Stack alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant="h6" gutterBottom color="initial">
                                        Shop
                                    </Typography>
                                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                                        <ScrollSectionRight>
                                            <Button variant='outlined' onClick={() => navigate('/shop')} color='secondary' sx={{width: 50, boxShadow: 5, border: 0, p: 4, borderRadius: '999px', height: 50}}>
                                                <ShoppingBagRounded fontSize='medium'/>
                                            </Button>
                                        </ScrollSectionRight>
                                        <Divider orientation='vertical' sx={{ border: 1, height: 80, mx: 3}}/>
                                        <Typography variant="body1" color="secondary" width={'100%'}>
                                            Explore our shop to find quality items at affordable prices — from everyday essentials to timeless pieces that add style and value to your home.
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant="h6" gutterBottom color="initial" align='center' >
                                        Auction
                                    </Typography>
                                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                                        <ScrollSectionRight>
                                            <Button variant='outlined' onClick={() => navigate('/auction')} color='secondary' sx={{width: 50, boxShadow: 5, border: 0, p: 4, borderRadius: '999px', height: 50}}>
                                                <LocalOfferRounded fontSize='medium'/>
                                            </Button>
                                        </ScrollSectionRight>
                                        <Divider orientation='vertical' sx={{ border: 1, height: 80, mx: 3}}/>
                                        <Typography variant="body1" color="secondary" width={'100%'}>
                                            Enter our auction and experience the thrill of bidding on unique treasures — compete, win, and bring home one-of-a-kind finds at the best value.
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </section>
                        <section style={{height: '100%'}}>
                            <Stack alignItems={'center'} mb={3}>
                                <Typography variant="h5" color="initial" align='center'>Item Classification</Typography>
                                <Typography variant="body1" color="secondary" align='center'>Learn which items are available for local and international shipping</Typography>
                            </Stack>
                            <Stack gap={3}>
                                <Grid container spacing={3}>
                                    <Grid size={{xs: 6}} height={300}>
                                        <img 
                                            src="/ideal-objects-prepare-cocktails.jpg"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'block',
                                                borderRadius: '10px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 6}}>
                                        <Stack height={300}>
                                            <Typography variant="subtitle1" color="initial">Small items</Typography>
                                            <Divider sx={{my: 1}}/>
                                            <Typography variant="body1" color="secondary" sx={{overflowY: 'scroll', height: '100%'}}>
                                                Small items are lightweight and easy to ship, making them available for both local and international users. These include portable products such as bags, small appliances, home décor, and other compact merchandise. They are carefully packaged to ensure safe and affordable delivery, no matter where you are.
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 6}}>
                                        <Stack height={300}>
                                            <Typography variant="subtitle1" color="initial">Large items</Typography>
                                            <Divider sx={{my: 1}}/>
                                            <Typography variant="body1" color="secondary" sx={{overflowY: 'scroll', height: '100%'}}>
                                                Furniture and other bulky products that require special handling and local delivery services. Due to size and shipping constraints, these items are only available for local or users within <b>Region V</b> within our service area. Local customers can enjoy convenient delivery or in-store pickup for these larger pieces to ensure safety and quality upon arrival.
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{xs: 6}} height={300}>
                                        <img 
                                            src="/interior-design-house-modern-wooden-table-chair.jpg"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'block',
                                                borderRadius: '10px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </section>
                        <section>
                            {(liveAuctions.length > 0) &&
                                <Stack gap={1}>
                                    <Stack alignItems={'center'} sx={{mb: 2}}>
                                        <Typography variant="h5" color="initial">
                                            Live Auctions Are On!
                                        </Typography>
                                        <Typography variant="body1" color="secondary" align='center'>
                                            Join the excitement — bid live, win big, and make it yours today!
                                        </Typography>
                                    </Stack>
                                    <Container>
                                        <AuctionLiveDisplayer auctions={liveAuctions}/>
                                    </Container>
                                </Stack>
                            }
                        </section>
                        <section>
                            {pendingAuctions.length > 0 &&
                                <Container>
                                    {pendingAuctions.map((pending) => 
                                        <Box key={pending._id}>
                                            <AuctionPendingDisplayer auction={pending}/>
                                        </Box>
                                    )}
                                </Container>
                            }
                        </section>
                        <section>
                            <Stack alignItems={'center'}>
                                <Typography variant='h5' color='initial'>
                                    Handpicked just for you
                                </Typography>
                                <Typography variant='body1' color='secondary' align='center' sx={{mb: 1}}>
                                    Spotlight on products we think you’ll love the most
                                </Typography>
                                <Box sx={{width: '100%', px: 2}}>
                                    <FeaturedProductCarousel/>
                                </Box>
                            </Stack>
                        </section>
                        <section>
                            <Stack>
                                <Stack alignItems={'center'} sx={{mb: 2}}>
                                    <Typography variant="h5" color="initial">
                                        New in Store
                                    </Typography>
                                    <Typography variant="body1" color="secondary">
                                        Be the first to grab our newest arrivals
                                    </Typography>
                                </Stack>
                                <Box>
                                    <NewArrival/>
                                </Box>
                            </Stack>
                        </section>
                        <section>
                            <Stack>
                                <Stack alignItems={'center'} sx={{mb: 1}}>
                                    <Typography variant="h5" color="initial">
                                        Pick your style
                                    </Typography>
                                    <Typography variant="body1" color="secondary" align='center'>
                                        Jump into categories to match your needs
                                    </Typography>
                                </Stack>
                                <Box>
                                    <CategoriesList/>
                                </Box>
                            </Stack>
                        </section>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}