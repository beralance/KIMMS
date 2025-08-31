import React from 'react'
import AutoSlideCarousel from '../../../components/AutoSlideCarousel'
import FeaturedProductCarousel from '../../../components/FeaturedProductCarousel'
import { Box, Container, Typography } from '@mui/material'

export default function Home () {
    return (
        <React.Fragment>
            <Box>
                <AutoSlideCarousel/>
                
                <Container maxWidth="lg">
                    <Typography variant="h4" component='h2' color="secondary" sx={{mb: 2,}}>
                        Don't miss out our featured products!
                    </Typography>
                    <Box sx={{mx: 1}}>
                        <FeaturedProductCarousel/>
                    </Box>
                </Container>
            </Box>
        </React.Fragment>
    )
}

