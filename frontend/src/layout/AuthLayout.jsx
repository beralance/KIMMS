import React from 'react'
import { Container, Box, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

const AuthLayout = ({children}) => {
    const navigate = useNavigate();
    
    return (
        <Container
            maxWidth="xs"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 3,
            }}
        >
        {/* Go back / close button */}
        <Box alignSelf="flex-start" sx={{position: 'absolute'}}>
            <IconButton component={NavLink} to='/'>
                <ArrowBackIcon />
            </IconButton>
        </Box>

        {/* Render either login or signup form */}
        <Box sx={{ width: "100%"}}>{children}</Box>
        
    </Container>
    )
}

export default AuthLayout
