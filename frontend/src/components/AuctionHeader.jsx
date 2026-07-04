import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CartHeader = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="fixed" color="secondary" sx={{height: '60px'}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    onClick={() => navigate('/auction/listing')}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIcon/>
                </IconButton>

                <Box>
                    <Typography variant="body1" component="div">
                        A U C T I O N
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default CartHeader
