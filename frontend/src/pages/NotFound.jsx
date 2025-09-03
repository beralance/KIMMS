import Box from "@mui/material/Box"
import React from 'react'
import Button from '@mui/material/Button'
import { NavLink } from "react-router-dom"
import Typography from '@mui/material/Typography'
import { Stack } from "@mui/material"
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded'
const NotFound = () => {
    return (
        <Stack sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{pb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h2" color="initial" sx={{display: 'flex', alignItems: 'center'}}>
                    4
                    <ErrorOutlineRoundedIcon sx={{color: 'red', fontSize: '60%'}}/>
                    <Box style={{transform: 'scaleX(-1)'}}>4</Box>
                </Typography>
                <Typography variant="h4" component='h1' color="secondary"> 
                    Page Not Found
                </Typography>
                <Typography variant="body2" color="grey" sx={{textAlign: 'center'}}>
                    The page you're looking for doesn't exist or has been removed.
                </Typography>
            </Box>
            <Button component={NavLink} to='/' variant="contained" color="secondary"
                sx={{px: 5, width: 200, borderRadius: '999px'}}
            >
                <ArrowLeftRoundedIcon fontSize="large"/>
                Go Back
            </Button>
        </Stack>
    )       
}

export default NotFound
