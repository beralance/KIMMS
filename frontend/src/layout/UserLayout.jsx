import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from '../components/UserHeader'
import UserFooter from '../components/UserFooter'

const UserLayout = () => {
    return (
        <Box>
            <header>
                <UserHeader/>
            </header>

            <main>
                <Box sx={{m: 0, pt: {xs: '56px', sm: '64px'}}}>
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
