import { Box, Stack, Typography, Container } from '@mui/material'
import React from 'react'

const AuctionHero = ({children}) => {
    return (
        <>
            <Box 
                sx={{
                    height: '100vh',
                    position: 'relative'
                }}
            >
                <video autoPlay muted loop style={{height: '100vh', width: '100%', objectFit: 'cover',}}>
                    <source src="https://ryanbajkoeratpmdwvuy.supabase.co/storage/v1/object/public/Kimms%20Bucket/assets/background-video.mp4" type="video/mp4"/>
                    Your Browser does not support this video tag.
                </video>
                <Box
                    sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                        height: '100vh',
                        position: 'absolute',
                        top: 0, right: 0, left: 0, bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Stack sx={{pb: 10}}>
                        <Container>
                            <Typography variant="h5" align='center' color="white">
                                Every Auction Holds a Story
                            </Typography>
                            <Typography variant="body1" align='center' color="white" sx={{opacity: '0.8'}}>
                                A journey through rare finds
                            </Typography>
                        </Container>
                    </Stack>
                </Box>
            </Box>
            <Box sx={{pt: 10, bgcolor: '#fafafa'}}>
                {children}
            </Box>
        </>
    )
}

export default AuctionHero
