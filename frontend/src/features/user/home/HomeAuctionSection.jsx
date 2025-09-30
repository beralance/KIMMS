import { Box, Button, Container, Fade, Grow, Stack, Typography } from '@mui/material'
import React, {Children, useEffect, useRef, useState} from 'react'
import { motion } from 'framer-motion'
import SectionTransition from '../../../components/SectionTransition'

export default function UserHero({children}) {
    return(
        <>
            <Box
                sx={{
                    height: '100vh',
                    backgroundImage: 'url(/view-house-lamp-with-futuristic-design.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'sticky',
                    top: 0,
                    width: '100%'
                }}  
            />
            <Stack sx={{width: '100%'}}>
                <Typography variant="h5" color="white">aksjdhf</Typography>
            </Stack>
            <Box
                sx={{
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%)",
                    maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%)",
                    zIndex: 1,
                    height: '200vh',
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: "white",
                    display: 'flex', 
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    position: "relative", // important to anchor the gradient
                    
                }}
            >
                {children}
            </Box>
        </>
    )
}