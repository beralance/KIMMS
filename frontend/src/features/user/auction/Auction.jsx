import React from 'react'
import {} from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'
import AuctionListing from './AuctionListing'
import AuctionHistory from './AuctionHistory'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Auction = () => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Box>
            <Stack>
                <Stack>
                    <Button onClick={() => navigate( location.pathname === '/auction/listing' ? '/auction/history' : '/auction/listing')}>
                        {location.pathname === '/auction/listing' ? 'History' : 'Listing'}
                    </Button>
                </Stack>
            </Stack>
            <Box>
                <Outlet/>
            </Box>
        </Box>
    )
}

export default Auction
