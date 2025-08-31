import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from '../components/UserHeader'

const AdminLayout = () => {
    return (
        <Box>
            <div>
                <h1>Admin Layout Sample</h1>
            </div>

            <main>
                <Outlet/>
            </main>
        </Box>
    )
}

export default AdminLayout
