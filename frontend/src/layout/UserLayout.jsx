import { Box, Button } from '@mui/material'
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

            <footer>
                <UserFooter/>
            </footer>
        </Box>
    )
}

export default UserLayout
