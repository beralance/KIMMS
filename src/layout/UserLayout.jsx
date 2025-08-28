import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from '../components/UserHeader'

const UserLayout = () => {
    return (
        <Box>
            <header>
                <UserHeader/>
            </header>

            <main>
                <Outlet/>
            </main>

            <footer>
                <h3>Sample Footer</h3>
            </footer>
        </Box>
    )
}

export default UserLayout
