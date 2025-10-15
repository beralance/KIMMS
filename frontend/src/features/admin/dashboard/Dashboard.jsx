import React, { useState } from 'react'
import { Box, Button, ButtonGroup, CircularProgress, Container, Skeleton, Stack, Typography } from '@mui/material'
import AdminAutoSlideCarousel from '../../../components/AdminAutoSlideCarousel'
import { useNavigate } from 'react-router-dom'
import AdminHero from './AdminHero'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DateCalendar} from '@mui/x-date-pickers'
import {fetchCombinedReport} from '../../../utils/reportsApi'
import dayjs from 'dayjs'
import { useEffect } from 'react'


const Dashboard = () => {
    const navigate = useNavigate()
    const [reportData, setReportData] = useState(null)
    const [loading, setLoading] = useState(false)

    const goToAddInventory = () => {
        navigate('/admin/inventory/manage-inventory', {state: {openDialog: true}})
    }
    const goToPostProduct = () => {
        navigate('/admin/inventory/manage-product', {state: {openDialog: true}})
    }
    const goToCreateAuction = () => {
        navigate('/admin/inventory/manage-auction', {state: {openDialog: true}})
    }


    useEffect(() => {
        const loadReport = async () => {
            try {
                const data = await fetchCombinedReport({period: 'month'})
                setReportData(data)
            }
            catch(error) {
                console.error('Failed to load report:', error)
            }
        }
        loadReport()
    }, [])


    return (
        <>
            <Box >
                <AdminHero/>
            </Box>
            <Stack sx={{pb: 20}}>
                <Stack>
                    {reportData ? (
                        <Stack>
                            {/*
                                <Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateCalendar views={['day']} readOnly/>
                                    </LocalizationProvider>
                                </Box>
                                <Stack>
                                <div className="dashboard">
                                    <section className="inventory-cards">
                                        <div className="card">Total Products: {reportData.inventory.totalProducts}</div>
                                        <div className="card">Active Listings: {reportData.inventory.activeListings}</div>
                                        <div className="card">Sold This Week: {reportData.inventory.soldThisWeek}</div>
                                        <div className="card">Total Sold: {reportData.inventory.soldItems}</div>
                                    </section>

                                    <section className="auctions-cards">
                                        <div className="card">Total Auctions: {reportData.auctions.totalAuctions}</div>
                                        <div className="card">Live: {reportData.auctions.liveAuctions}</div>
                                        <div className="card">Pending: {reportData.auctions.pendingAuctions}</div>
                                    </section>

                                    <Stack sx={{bgcolor: '#f0f0f0', p: 2, borderRadius: 5, my: 5}} gap={2}>
                                        <section className="auctions-cards">
                                            {reportData.auctions.alerts.map((upcoming, index) => (
                                                <div key={index}>
                                                    <div className="card" style={{fontWeight: 'bold'}}>Type: {upcoming.type}</div>
                                                    <div className="card">Upcoming Auction: {upcoming.message}</div>
                                                </div>
                                            ))}
                                        </section>
                                    </Stack>

                                    <div className="card">Live: {reportData.auctions.liveAuctions}</div>
                                    <div className="card">Pending: {reportData.auctions.pendingAuctions}</div>
                                    <section className="alerts">
                                        <h3>System Alerts</h3>
                                        <ul>
                                            {reportData.auctions.alerts.map((alert, i) => (
                                                <li key={i}>{alert.message}</li>
                                            ))}
                                        </ul>
                                    </section>
                                </div>
                            </Stack>
                            */}
                        </Stack>
                        )
                        :
                        (
                            <Box>
                                <Typography variant="body1" component={'div'} color="initial">
                                    <CircularProgress/>
                                    Getting Data...
                                </Typography>
                            </Box>
                        )
                    }
                </Stack>
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
            </Stack>
        </>
    )       
}

export default Dashboard
