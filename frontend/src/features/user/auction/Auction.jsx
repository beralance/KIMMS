import React from 'react'
import {} from '@mui/icons-material'
import { Box, Button, Stack, Typography, Container } from '@mui/material'
import AuctionListing from './AuctionListing'
import AuctionHistory from './AuctionHistory'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AuctionHero from './AuctionHero'
import AuctionHistoryPreview from './AuctionHistoryPreview'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'


const Auction = () => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Box>
            <AuctionHero>
                <Container>
                    <Stack gap={5}>
                        {location.pathname === '/auction/listing' ? 
                            <Stack gap={1}>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Typography variant="subtitle2" color="initial">
                                        Check auction history
                                    </Typography>
                                    <Button onClick={() => navigate('/auction/history')}>
                                        <ChevronRightIcon/>
                                    </Button>
                                </Stack>
                                <AuctionHistoryPreview/>
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
