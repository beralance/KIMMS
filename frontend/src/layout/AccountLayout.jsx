import React from 'react'
import CartHeader from '../components/CartHeader'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { ChevronLeftIcon } from 'lucide-react'

const AccountLayout = () => {
    const navigate = useNavigate()

    return (
        <Box>
            <header>
                <AppBar position="fixed" color="secondary">
                    <Toolbar sx={{display: 'flex', height: 60, justifyContent: 'space-between'}}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="back"
                            onClick={() => navigate(-1)}
                            sx={{ mr: 2 }}
                        >
                            <ChevronLeftIcon style={{color: 'white'}}/>
                        </IconButton>
        
                        <Box>
                            <Button component={Link} to='/' color=''>
                                <Typography variant="body1" component="div">
                                    K I M M S 
                                </Typography>
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </header>
            <main style={{marginTop: '60px', backgroundColor: '#f0f0f0ff', height: '100%'}}>
                <Outlet/>
            </main>   
        </Box>
    )
}

export default AccountLayout
