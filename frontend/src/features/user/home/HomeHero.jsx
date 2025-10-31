import { Box, Button, Container, Divider, Fade, Grow, Stack, Typography, ButtonGroup } from '@mui/material'
import React, {useEffect, useRef, useState} from 'react'
import { motion } from 'framer-motion'
import SectionTransition from '../../../components/SectionTransition'
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import ShopProductPreview from './components/ShopProductPreview'
import { UserRoundIcon, UserRoundPenIcon } from 'lucide-react'


export default function UserHero() {
    const navigate = useNavigate()
    const {user} = useAuth()

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
            <Box
                sx={{
                    height: "100vh",
                    color: "white",
                    overflowY: 'scroll',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth',
                    scrollbarColor: 'transparent transparent',
                    scrollbarWidth: 'none',
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    p: 0,
                    background:
                    "linear-gradient(to top, rgba(255,255,255,255), rgba(0,0,0,.5))",
                }}
            >
                {/*Section 1*/}
                <Container 
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '90vh',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                        flexShrink: 0,
                    }}
                >
                    <Stack justifyContent={'center'} alignItems={'center'} height={'100%'} pb={10}>
                        <Grow in={true} mountOnEnter unmountOnExit timeout={1000}>
                            <img src="/kimms-logo.svg" alt="" style={{filter: 'invert(1)', zIndex: 2, width: 60, height: 60}}/>
                        </Grow>
                        <Fade in={true} mountOnEnter unmountOnExit timeout={1000}>
                            <Box sx={{zIndex: 2}}>
                                <Typography color='white' variant='h4' align='center'>
                                    Discover hidden gems
                                </Typography>
                                <Typography color='white' variant='body2' gutterBottom align='center'>
                                    “Timeless pieces made for every home.”
                                </Typography>
                            </Box>
                        </Fade>
                        <Grow in={true} mountOnEnter unmountOnExit timeout={1000}>
                            <Button variant='contained' onClick={() => navigate('/shop')} sx={{zIndex: 2, bgcolor: 'rgba(0,0,0,.7)', my: 2, boxShadow: 5, borderRadius: '999px', px: 3}}>
                                Shop Now
                            </Button>
                        </Grow>
                    </Stack>
                </Container>
            
                {/*Section 2*/}
                {!user &&

                    <Container
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '90vh',
                            scrollSnapAlign: 'start',
                            scrollSnapStop: 'always',
                            flexShrink: 0,
                        }}
                    >
                        <SectionTransition sx={{height: '100%'}}>
                            <Stack alignItems={'center'} gap={3} justifyContent={'center'}>
                                <Stack alignItems={'center'}>
                                    <Typography variant="h5" color="white" align='center' gutterBottom>Let's Get You Started!</Typography>
                                    <Typography variant="body2" color="white" align='center'>Log in to continue your journey — or sign up and discover our collection</Typography>
                                </Stack>
                                <Stack width={'80vw'}>
                                    <ShopProductPreview/>
                                </Stack>
                                <Stack direction={'row'} px={2} gap={1} alignItems={'center'} width={'80%'}>
                                    <Button 
                                        variant='text' 
                                        fullWidth
                                        onClick={() => navigate('/auth/login')}
                                        sx={{
                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                            borderRadius: '999px',
                                            backdropFilter: 'blur(5px)',
                                            color: 'white',
                                            border: "1px solid rgba(255, 255, 255, 0.8)",
                                            boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        <UserRoundIcon style={{color: 'white'}}/>
                                        LOGIN
                                    </Button>
                                    <Typography variant="body1" color="initial">/</Typography>
                                    <Button 
                                        variant='text' 
                                        fullWidth
                                        onClick={() => navigate('/auth/signup')}
                                        sx={{
                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                            borderRadius: '999px',
                                            backdropFilter: 'blur(5px)',
                                            color: 'white',
                                            border: "1px solid rgba(255, 255, 255, 0.8)",
                                            boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        <UserRoundPenIcon style={{color: 'white'}}/>
                                        REGISTER
                                    </Button>
                                </Stack>
                            </Stack>
                        </SectionTransition>
                    </Container>
                }

                {/*Section 3*/}
                <Container
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                        flexShrink: 0,
                    }}
                >
                    <SectionTransition  sx={{height: '100%'}}>
                        <Stack pb={10}>
                            <Box sx={{width: '100%', flexDirection: 'column', alignItems: 'center', pb: 1, display: 'flex', justifyContent: 'center',}}>
                                <img src="/sofa.svg" alt="" style={{aspectRatio: '1/1', width: 80, marginBottom: -38, filter: 'invert(1)'}}/>
                                <Typography 
                                    variant="body1" 
                                    color="white" 
                                    fontSize={80}
                                    align='center'
                                    noWrap
                                    gutterBottom
                                    sx={{mb: -5, fontSize: 'clamp(20px, 20vw, 80px)'}}
                                    fontFamily={"'Cormorant Garamond', 'Playfair Display', 'Didot', 'Bodoni MT', 'Garamond', 'Times New Roman', 'serif'"}

                                >
                                    K I M M S
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="white" align='center'>
                                Kimms Furniture and Merchandise brings you affordable finds with lasting quality that never goes out of style.
                            </Typography>
                            <Button 
                                variant='outlined' 
                                color='secondary' 
                                sx={{
                                    width: 150, 
                                    alignSelf: 'center', 
                                    borderRadius: '999px', 
                                    fontWeight: 'bold', 
                                    my: 2,
                                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(5px)',
                                    color: 'white',
                                    border: "1px solid rgba(255, 255, 255, 0.8)",
                                    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    textDecoration: 'underline',
                                }}>
                                About Us
                            </Button>
                        </Stack>
                    </SectionTransition>
                </Container>
                <Box
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '70vh',
                        scrollSnapAlign: 'start',
                        flexShrink: 0,
                    }}
                >
                    <Stack gap={1} alignItems={'center'}>
                        <img 
                            src="/kimms-logo.svg"
                            style={{
                                filter: 'invert(1)',
                                width: '50px',
                                height: '50px',
                                display: 'block',
                            }}  
                        />
                        <Stack>
                            <Typography variant="subtitle1" alignSelf={'center'} justifySelf={'center'} color="white" align='center'>
                                - Enjoy shopping at Kimms! -
                            </Typography>
                            <Typography variant="body2" alignSelf={'center'} justifySelf={'center'} color="white" align='center'>
                                We’re glad to have you here
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </>
    )
}