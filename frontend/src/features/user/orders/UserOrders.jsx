import React, { useContext, useEffect, useState } from 'react'
import {OrderContext} from '../../../contexts/OrderContext'
import { ProductContext } from '../../../contexts/ProductContext'
import { Box, Divider, Container, Stack, Typography } from '@mui/material'
import OrderContainer from './OrderContainer'
import OrderTab from './OrderTab'
import SectionWrapper from '../../../components/SectionWrapper'
import {useAuth} from '../../../contexts/AuthContext'
import FullScreenLoader from '../../../components/FullScreenLoader'
import MostViewedProducs from './MostViewedProducs'


const UserOrders = () => {
    const {user} = useAuth()
    const {orders, fetchOrders} = useContext(OrderContext)
    const {products} = useContext(ProductContext)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true)
        try {
            fetchOrders()
        }
        catch (err) {
            console.error('Problem fetching orders', err)
        }
        finally {
            setLoading(false)
        }
    }, [])

    const successOrders = orders.filter(o => 
        o.isActive === true &&
        (o.orderStatus === 'SUCCESSFUL' || o.orderStatus === 'CANCELLED') &&
        o.userId?._id === user.userId
    );

    const mostViewedProduct = products
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)

    return (
        <Box py={2}>
            <Container>
                <Stack gap={2}>
                    <Stack>
                        <Typography variant="subtitle1" color="secondary">My Purchases</Typography>
                        <Typography variant="body2" color="gray">Track your orders and see what you’ve purchased</Typography>
                    </Stack>
                    <OrderTab orders={successOrders}/>
                </Stack>
                <Divider sx={{my: 5}}>
                    <Typography variant="body2" color="gray">
                        You may also like
                    </Typography>
                </Divider>
                <SectionWrapper>
                    <MostViewedProducs products={mostViewedProduct}/>
                </SectionWrapper>
            </Container>
            <FullScreenLoader open={loading}/>
        </Box>
    )
}

export default UserOrders
