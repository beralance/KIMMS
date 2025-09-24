import React, { useEffect, useRef, useState } from 'react'
import AutoSlideCarousel from '../../../components/AutoSlideCarousel'
import FeaturedProductCarousel from '../../../components/FeaturedProductCarousel'
import { Box, Container, Fade, Slide, Typography} from '@mui/material'
import HomeHero from './HomeHero'

export default function Home () {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.05}
        )
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [])
    return (
        <React.Fragment>
            <Box>
                <HomeHero/>
                <Container maxWidth="lg">
                    
                    <Box ref={ref} sx={{mx: 1, mb: 5}}>
                        <Fade timeout={300} in={visible}>
                            <Box>
                                <FeaturedProductCarousel/>
                            </Box>
                        </Fade>    
                    </Box>
                </Container>
            </Box>
        </React.Fragment>
    )
}

