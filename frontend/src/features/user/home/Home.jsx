import React, { useEffect, useRef, useState } from 'react'
import AutoSlideCarousel from '../../../components/AutoSlideCarousel'
import FeaturedProductCarousel from '../../../components/FeaturedProductCarousel'
import { Box, Button, Container, Divider, Fade, Slide, Stack, Typography} from '@mui/material'
import SectionTransition from '../../../components/SectionTransition'
import {ScrollSectionRight} from '../../../components/SectionTransitionX'
import { LocalOfferRounded, ShoppingBagRounded, TagRounded } from '@mui/icons-material'
import HomeHero from './HomeHero'
import HomeAuctionSection from './HomeAuctionSection'
import { ScrollOnTop } from '../../../utils/scrollOnTop'
import CategoriesList from './CategoriesList'
import NewArrival from './NewArrival'


export default function Home () {
    ScrollOnTop()

    return (
        <React.Fragment>
            <HomeHero/>
            <Box sx={{bgcolor: 'white', py: 5}} >
                <Container>
                    <section>
                        <Stack gap={2} sx={{pb: 12}} justifyContent={'center'}>
                            <Stack alignItems={'center'} justifyContent={'center'}>
                                <Typography variant="h6" gutterBottom color="initial">
                                    Shop
                                </Typography>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                                    <ScrollSectionRight>
                                        <Button variant='outlined' color='secondary' sx={{width: 50, boxShadow: 5, border: 0, p: 4, borderRadius: '999px', height: 50}}>
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
                                        <Button variant='outlined' color='secondary' sx={{width: 50, boxShadow: 5, border: 0, p: 4, borderRadius: '999px', height: 50}}>
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
                    <section>
                        <Stack alignItems={'center'} sx={{mb: 12}}>
                            <Typography variant='h5' color='initial'>
                                Handpicked just for you
                            </Typography>
                            <Typography variant='body1' color='secondary' align='center' sx={{mb: 3}}>
                                Spotlight on products we think you’ll love the most
                            </Typography>
                            <Box sx={{width: '100%', px: 2}}>
                                <FeaturedProductCarousel/>
                            </Box>
                        </Stack>
                    </section>
                    <section>
                        <Stack mb={12}>
                            <Stack alignItems={'center'} sx={{mb: 1}}>
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
                        <Stack mb={12}>
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
                </Container>
                <HomeAuctionSection>
                    <Box>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                        <h1>test</h1>
                    </Box>
                </HomeAuctionSection>
            </Box>
        </React.Fragment>
    )
}

