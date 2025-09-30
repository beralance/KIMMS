import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Box, Slide, Button, Fade, Grow, Stack, Typography} from '@mui/material'

const UserHero = () => {
    const navigate = useNavigate()

    return (
        <Box sx={{height: '100vh', overflow: 'hidden', position: 'relative', mb: 5}}>
            <Box sx={{position: 'absolute', inset: 0, transform: 'scale(1.1)', filter: 'blur(8px)', backgroundImage: "url('/home-background.jpg')", backgroundSize: 'cover',  }}></Box>
            <Stack sx={{alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative', pb: 20, pt: 10}}>
                
                {/* Top right leaf graphic */}
                <Slide direction='left' in={true} timeout={800} mountOnEnter unmountOnExit>
                    <Box sx={{position: 'absolute', top: 0, right: 0}}>
                        <img src="/home-leaf-graphic.png" alt="home-furniture-graphic" style={{width: '350px'}}/>
                    </Box>
                </Slide>

                {/* Main graphic */}
                <Stack sx={{justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
                    <Slide direction='down' in={true} timeout={600} mountOnEnter unmountOnExit>
                        <img src="/kimms-logo-full.svg" alt="kimms-logo-full" style={{width: '150px'}} />
                    </Slide>
                    
                    <Fade in={true} timeout={2000} mountOnEnter unmountOnExit>
                        <Stack sx={{alignItems: 'center'}}>
                            <Typography variant="body1" color='#575757ff' sx={{fontWeight: 'bold'}}>
                                "Style your space with unique finds"
                            </Typography>
                        </Stack>
                    </Fade>

                    <Slide direction='up' in={true} timeout={800} mountOnEnter unmountOnExit>
                        <img src="/home-furniture-graphic.png" alt="home-furniture-graphic" style={{width: '350px'}}/>
                    </Slide>

                    <Grow timeout={1500} in={true} mountOnEnter unmountOnExit>
                        <Button variant='contained' color='secondary' onClick={() => navigate('/shop')} sx={{ fontWeight: 'bold', my: 5, borderRadius: '999px', p: 1, px: 4}}> 
                            Shop Now
                        </Button>
                    </Grow>
                </Stack>

                {/* Bottom left leaf graphic */}
                <Slide direction='right' in={true} timeout={800} mountOnEnter unmountOnExit>
                    <Box sx={{position: 'absolute', bottom: -6, left: 0}}>
                        <img src="/home-leaf-graphic.png" alt="home-furniture-graphic" style={{width: '350px', transform: 'scale(-1, -1'}}/>
                    </Box>
                </Slide>
            </Stack>
        </Box>
    )
}

export default UserHero
