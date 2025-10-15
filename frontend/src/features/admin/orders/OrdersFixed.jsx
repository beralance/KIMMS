// src/components/Orders.jsx (or PendingOrders.jsx if you keep that name)
import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Container, Stack} from "@mui/material";
import { OrderContext } from "../../../contexts/OrderContext";
import { formatNumber, toTitleCase } from "../../../utils/stringUtils";

import OrderCard from "./OrderCard";

const statusOptions = ["Pending", "Confirmed", "Processing", "Out for Delivery", "Deliver", "Cancel"];

export default function OrdersTable() {
    const { orders, updateOrderStatus } = useContext(OrderContext);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [isOnline, setIsOnline] = useState(true);

    console.log('OR OR OR DER DER DER', orders)

    useEffect(() => {
        // add logic, if purchase status pending and payment status pending (cod, cop) display confirm order
        const filtered = orders.filter(o => {
            if (o.isActive && o.orderType === 'fixed') {
                if (o.paymentMethod === 'gcash' || o.paymentMethod === 'card') {
                    setIsOnline(true)
                    return o.paymentStatus?.toLowerCase() === "paid" &&
                        o.purchaseStatus?.toLowerCase() !== "pending"
                }
                else if (o.paymentMethod === 'cashOnPickup' || o.paymentMethod === 'cashOnDelivery') {
                    setIsOnline(false)
                    return o.paymentStatus?.toLowerCase() === 'pending' &&
                        o.purchaseStatus?.toLowerCase() === 'pending'
                }
            }
            else {
                console.log(`Order ${o._id} is inactive`)
            }
        });
        console.log('SAMPLE', filtered)
        setPendingOrders(filtered);
    }, [orders]);

    console.log('PENDING THIS', pendingOrders)
    const handleUpdateStatus = async (orderId, newStatus) => {
        const updated = await updateOrderStatus(orderId, newStatus);
        if (!updated.error) {
            setPendingOrders(prev =>
                prev
                    .map(o => (o._id === orderId ? updated : o))
                    .filter(o => o.purchaseStatus.toLowerCase() === 'pending')
            );
        }
    };

	return (
        <>
            <Container>
                <Typography variant="body1" color="initial" sx={{py: 2}}>Order List</Typography>
                <Stack gap={2} >
                    {pendingOrders.map(order =>
                        <Box key={order._id}> 
                            <OrderCard orderData={order}/>
                        </Box>
                    )}
                </Stack>
            </Container>
        </>
	);
}
