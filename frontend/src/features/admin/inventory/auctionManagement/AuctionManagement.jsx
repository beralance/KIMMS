import React from 'react'
import AuctionMonitor from './AuctionMonitor'
import { useOutletContext } from 'react-router-dom'
import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material' 


const AuctionManagement = () => {
    const {searchTerm, setSearchTerm} = useOutletContext()
    return (
        <Box>
            <Stack>
                <Typography variant="h6" color="secondary" sx={{fontWeight: 'bold'}} gutterBottom>
                    Auction Monitoring
                </Typography>
                <Typography variant="body2" color="grey" gutterBottom>
                    * This section allows you to track auction activity. Any new bids or status changes will be displayed automatically as they occur.
                </Typography>
            </Stack>
            
            <AuctionMonitor searchTerm={searchTerm}/>
        </Box>
    )
}

export default AuctionManagement
