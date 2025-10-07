import React from 'react'
import AuctionHeader from '../components/AuctionHeader'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'


const AuctionLayout = () => {
    return (
        <Box>
            <header>
                <AuctionHeader/>
            </header>
            <main style={{paddingTop: '80px'}}>
                <Outlet/>
            </main>   
        </Box>
    )
}

export default AuctionLayout
