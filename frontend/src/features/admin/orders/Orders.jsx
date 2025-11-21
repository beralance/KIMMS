import React, { useContext, useEffect, useState } from 'react'
import {} from '@mui/icons-material'
import { Box, Button, Collapse, colors, Container, Stack, TextField, Typography } from '@mui/material'
import OrderList from './OrderList'
import OrderSearch from './OrderSearch'
import { useSnackbar } from '../../../contexts/SnackbarContext'
import SectionWrapper from "../../../components/SectionWrapper";
import { OrderContext } from "../../../contexts/OrderContext";
import { PackageSearchIcon } from 'lucide-react'


const statusOptions = ["Pending", "Confirmed", "Processing", "Out for Delivery", "Deliver", "Cancel"];

const Orders = () => {
    const { searchOrder, fetchOrders, orders } = useContext(OrderContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [pendingOrders, setPendingOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState("");
    const {showSnackbar} = useSnackbar()

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(o => {
            try {
                const filtered = orders.filter(o => {
                    if ((o.isActive && o.orderStatus === 'SUCCESSFUL') || (o.isActive && o.orderStatus === 'CANCELLED' && o.purchaseStatus === 'cancelled')) {
                        return true;
                    }
                    else {
                        console.log(`Order ${o._Id} is inactive or not fixed `);
                        return false
                    }
                })
                setPendingOrders(filtered);
            }
            catch (err) {
                console.error(err)
            }
        });

    }, [orders]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            showSnackbar('Nothing to search. You can use only use order ID', 'warning')
            return;
        }
        setError("");
        const result = await searchOrder(searchTerm.trim());

        if (result?.error) {
            setError(result.error);
            setSelectedOrder(null);
        } else {
            setSelectedOrder({id: result?._id, purchaseStatus: result?.purchaseStatus});
            showSnackbar(`${result.orderId} found!`, 'success')
            setSearchTerm('')
            console.log("✅ Found order:", result._id);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <>
            <Stack bgcolor={'#f0f0f0'} height={'100%'} pb={5} py={2}>
                <Container>
                    <Stack gap={2}>
                        <Stack>
                            <Typography variant="subtitle1" color="secondary">Orders & Purchases</Typography>
                            <Typography variant="body2" color="gray">Manage and track all customer orders and purchase activities</Typography>
                        </Stack>
                        <Stack gap={2} >
                            <SectionWrapper sx={{gap: 1,}}>
                                <Stack>
                                    <Typography variant="body2" color="secondary">Search Orders by Order ID</Typography>
                                </Stack>
                                <Stack direction={'row'} gap={1}>
                                    <TextField
                                        fullWidth
                                        label="Search Order ID..."
                                        variant="outlined"
                                        size="small"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        error={!!error}
                                        helperText={error || ''}
                                    />
                                    <Button variant='contained' color='secondary' onClick={() => handleSearch()}>
                                        <PackageSearchIcon style={{color: 'white',}}/>
                                    </Button>
                                </Stack>
                            </SectionWrapper>
                            <SectionWrapper>
                                <Stack gap={2}>
                                    <Stack>
                                        <Typography variant="subltitle2" color="secondary">Order List</Typography>
                                        <Typography variant="body2" color="gray">Browse all orders by their current status and type</Typography>
                                    </Stack>
                                    <OrderList selectedOrder={selectedOrder} orderData={pendingOrders}/>
                                </Stack>
                            </SectionWrapper>
                        </Stack>
                    </Stack>
                </Container>
            </Stack>
        </>
    )
}

export default Orders
