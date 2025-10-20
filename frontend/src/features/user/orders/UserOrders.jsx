import React, { useContext, useEffect } from 'react'
import {OrderContext} from '../../../contexts/OrderContext'
import { Box, Stack, Typography } from '@mui/material'
import OrderContainer from './OrderContainer'
import OrderTab from './OrderTab'
import SectionWrapper from '../../../components/SectionWrapper'


const UserOrders = () => {
    const {orders, fetchOrders} = useContext(OrderContext)
    
    useEffect(() => {
        fetchOrders()
    }, [])

    const visibleOrders = orders.filter(o => {
        if ((o.paymentMethod === 'gcash' && o.paymentStatus?.toLowerCase() === 'pending')) {
            return false
        }
        return true
    })

    return (
        <Box>
            <SectionWrapper>
                <Stack>
                    <Typography variant="body1" color="initial">
                        Change Address HERE
                    </Typography>
                </Stack>
            </SectionWrapper>
            <OrderTab orders={visibleOrders}/>
        </Box>
    )
}

export default UserOrders
