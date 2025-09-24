import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../features/admin/AdminSidebar'
import AutoSlideCarousel from '../components/AutoSlideCarousel'

const AdminLayout = () => {
    return (
        <Box>
            <AdminSidebar>
                <Outlet/>
            </AdminSidebar>
        </Box>
    )
}

export default AdminLayout
