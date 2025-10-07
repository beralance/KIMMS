import { Box, Button, Container, Fade, Grow, Stack, Typography } from '@mui/material'
import React, {useEffect, useRef, useState} from 'react'
import { motion } from 'framer-motion'
import SectionTransition from '../../../components/SectionTransition'
import {useNavigate} from 'react-router-dom'

export default function UserHero() {
    const navigate = useNavigate()


    return(
        <>
            <Box
                sx={{
                    height: '100vh',
                    backgroundImage: 'url(/modern-clean-interior-design.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    width: '100%'
                }}  
            />
            <Stack sx={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, width: '100%', height: '100%'}}>
                <Grow in={true} mountOnEnter unmountOnExit timeout={1000}>
                    <img src="/kimms-logo.svg" alt="" style={{filter: 'invert(1)', zIndex: 2, width: 60, height: 60}}/>
                </Grow>
                <Fade in={true} mountOnEnter unmountOnExit timeout={1000}>
                    <Box sx={{zIndex: 2}}>
                        <Typography color='white' variant='h4' align='center'>
                            Discover hidden gems
                        </Typography>
                        <Typography color='white' variant='subtitle2' gutterBottom align='center'>
                            “Timeless pieces made for every home.”
                        </Typography>
                    </Box>
                </Fade>
                <Grow in={true} mountOnEnter unmountOnExit timeout={1000}>
                    <Button variant='contained' onClick={() => navigate('/shop')} sx={{zIndex: 2, bgcolor: 'rgba(0,0,0,.5)', my: 2, boxShadow: 5, borderRadius: '999px', px: 3}}>
                        Shop Now
                    </Button>
                </Grow>
            </Stack>
            <Box
                sx={{
                    height: "180vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    position: "relative", // important to anchor the gradient
                    background:
                    "linear-gradient(to top, rgba(255,255,255,255), rgba(0,0,0,.5))",
                }}
            >
                <Container sx={{mt: 'auto'}}>
                    <SectionTransition>
                        <Stack mb={10} mt={5}>
                            <Box sx={{width: '100%', flexDirection: 'column', alignItems: 'center', pb: 1, display: 'flex', justifyContent: 'center',}}>
                                <img src="/sofa.svg" alt="" style={{aspectRatio: '1/1', opacity: 0.8, width: 100}}/>
                                <img src="/kimms-text.svg" alt="" style={{width: 250}}/>
                            </Box>
                            <Typography variant="subtitle1" color="initial" align='center'>
                                Kimms Furniture and Merchandise brings you affordable finds with lasting quality that never goes out of style.
                            </Typography>
                            <Button variant='outlined' color='secondary' sx={{width: 150, alignSelf: 'center', borderRadius: '999px', fontWeight: 'bold', my: 2}}>
                                About Us
                            </Button>
                        </Stack>
                    </SectionTransition>
                </Container>
            </Box>
        </>
    )
}