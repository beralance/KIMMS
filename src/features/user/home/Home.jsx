import React from 'react'
import AutoSlideCarousel from '../../../components/AutoSlideCarousel'
import FeaturedProductCarousel from '../../../components/FeaturedProductCarousel'
import { Box, Container } from '@mui/material'

export default function Home () {
    return (
        <React.Fragment>
            <AutoSlideCarousel/>
            <Container maxWidth="lg">
                <FeaturedProductCarousel/>
            </Container>
        </React.Fragment>
    )
}

