import React from 'react'
import { Container, Box, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
const AuthLayout = ({children}) => {
    const navigate = useNavigate();
    
    return (
        <Container
            maxWidth="xs"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 8,
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
        {/* Go back / close button */}
        <Box alignSelf="flex-start">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
        </Box>

        {/* Render either login or signup form */}
        <Box sx={{ width: "100%", mt: 2 }}>{children}</Box>
    </Container>
    )
}

export default AuthLayout
