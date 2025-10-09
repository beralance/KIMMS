import React, { useState } from 'react'
import { Box, Button, ButtonGroup, Container, Skeleton, Stack, Typography } from '@mui/material'
import AdminAutoSlideCarousel from '../../../components/AdminAutoSlideCarousel'
import { useNavigate } from 'react-router-dom'
import AdminHero from './AdminHero'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DateCalendar} from '@mui/x-date-pickers'
import dayjs from 'dayjs'
const Dashboard = () => {
    const navigate = useNavigate()

    const goToAddInventory = () => {
        navigate('/admin/inventory/manage-inventory', {state: {openDialog: true}})
    }
    const goToPostProduct = () => {
        navigate('/admin/inventory/manage-product', {state: {openDialog: true}})
    }
    const goToCreateAuction = () => {
        navigate('/admin/inventory/manage-auction', {state: {openDialog: true}})
    }

    return (
        <>
            <Box>
                <AdminHero/>
            </Box>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar views={['day']} readOnly/>
                </LocalizationProvider>
            </Box>
            <Container>
                <Box>
                    {/*Move quick actions to new component*/}
                    <Stack>
                        <Typography variant="body1" color="initial">
                            Quick Actions
                        </Typography>
                    </Stack>
                    <ButtonGroup>
                        <Button onClick={goToAddInventory}>
                            Add Inventory
                        </Button>
                        <Button onClick={goToPostProduct}>
                            Post Product
                        </Button>
                        <Button onClick={goToCreateAuction}>
                            Create Auction
                        </Button>
                    </ButtonGroup>
                </Box>
            </Container>
        </>
    )       
}

export default Dashboard
