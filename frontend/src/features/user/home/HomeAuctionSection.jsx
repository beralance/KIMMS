import { Box, Button, Container, Fade, Grow, Stack, Typography } from '@mui/material'
import React, {Children, useEffect, useRef, useState} from 'react'
import { motion } from 'framer-motion'
import SectionTransition from '../../../components/SectionTransition'

export default function UserHero({children, sx}) {
    return(
        <>
            <Box
                sx={{
                    height: '100vh',
                    backgroundImage: 'url(/modern-styled-entryway.jpg)',
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
            <Stack
                sx={{
                    zIndex: 1,
                    height: '100vh',
                    color: "white",
                    scrollSnapType: 'y mandatory',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth',
                }}
            >
                {children}
            </Stack>
        </>
    )
}