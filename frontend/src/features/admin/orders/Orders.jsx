import React, { useContext, useEffect, useState } from 'react'
import {} from '@mui/icons-material'
import { Stack } from '@mui/material'
import OrdersFixed from './OrdersFixed'
import FullScreenLoader from '../../../components/FullScreenLoader'
import OrderSearch from './OrderSearch'
import { OrderContext } from '../../../contexts/OrderContext'

const Orders = () => {
    const { searchOrder, fetchOrders } = useContext(OrderContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setError("");
        const result = await searchOrder(searchTerm.trim());

        if (result?.error) {
            setError(result.error);
            setSelectedOrder(null);
        } else {
            setSelectedOrder(result);
            console.log("✅ Found order:", result);
        }
    };
    return (
        <>
            <Stack>
                <OrderSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} error={error}/>
                <OrdersFixed selectedOrder={selectedOrder}/>
            </Stack>
        </>
    )
}

export default Orders
