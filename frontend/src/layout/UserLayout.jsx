import { Box, Button, Container, Divider, Typography } from '@mui/material'
import React, { useRef, useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import UserHeader from '../components/UserHeader'
import UserFooter from '../components/UserFooter'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRightRounded } from '@mui/icons-material'

const UserLayout = () => {
    const {user} = useAuth()    
    const navigate = useNavigate()


    return (
        
        <Box>
            <header>
                <UserHeader/>
            </header>

            <main>
                {user === 'admin' || user === 'staff' &&
                    <Box 
                        sx={{
                            position: 'absolute',
                            bottom: 10,
                            right: 0,
                        }}
                    >
                        <Button variant='contained' color='secondary' sx={{borderRadius: '999px'}} onClick={() => navigate('/admin')}>
                            To Admin
                        </Button>
                    </Box>
                }
                <Box sx={{m: 0, mt: {xs: '56px', sm: '64px'}}}>
                    <Outlet/>
                </Box>
            </main>
            <Container sx={{bgcolor: '#fafafa'}}>
                <Divider sx={{py: 10}}>
                    <img src='/sofa.svg' style={{width: '30px', opacity: '.8', marginInline: '15px'}} />
                </Divider>
            </Container>
            <footer>
                <UserFooter/>
            </footer>
        </Box>
    )
}

export default UserLayout
