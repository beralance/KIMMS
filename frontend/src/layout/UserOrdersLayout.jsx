import React from 'react'
import { AppBar, Box, Button, IconButton, Typography, Toolbar } from '@mui/material'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ArrowBackRounded } from '@mui/icons-material'

const UserOrdersLayout = () => {
    const navigate = useNavigate()
    return (
        <Box >
            <header>
                <Box>
                    <AppBar position="fixed" color="secondary">
                        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                            {/* Back button */}
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="back"
                                onClick={() => navigate('/')}
                                sx={{ mr: 2 }}
                            >
                                <ArrowBackRounded/>
                            </IconButton>

                            {/* Title */}
                            <Box>
                                <Button component={Link} to='/' color=''>
                                    <Typography variant="body1" component="div">
                                        K I M M S 
                                    </Typography>
                                </Button>
                            </Box>
                        </Toolbar>
                    </AppBar>
                </Box>
            </header>
            <main>
                <Box sx={{position: 'relative', top: 60, bgcolor: '#f0f0f0ff'}}>
                    <Outlet/>
                </Box>
            </main>
        </Box>
    )   
}

export default UserOrdersLayout
