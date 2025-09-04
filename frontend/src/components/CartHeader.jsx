import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CartHeader = () => {
    const navigate = useNavigate();
    const location = useLocation()

    const previousPage = location.state?.from || '/shop'

    return (
        <AppBar position="fixed" color="secondary">
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                {/* Back button */}
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    onClick={() => navigate(previousPage)} // go to previous page
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIcon/>
                </IconButton>

                {/* Title */}
                <Box>
                    <Button component={Link} to='/home' color=''>
                        <Typography variant="body1" component="div">
                            K I M M S 
                        </Typography>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default CartHeader
