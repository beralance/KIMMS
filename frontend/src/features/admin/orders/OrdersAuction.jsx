// src/components/Orders.jsx (or PendingOrders.jsx if you keep that name)
import React, { useContext, useEffect, useState } from "react";
import {
  Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  Container,
  Stack
} from "@mui/material";
import { OrderContext } from "../../../contexts/OrderContext";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import OrderCard from "./OrderCard";

const statusOptions = ["Pending", "Confirmed", "Processing", "Out for Delivery", "Deliver", "Cancel"];

export default function OrdersTable() {
    const { orders, updateOrderStatus } = useContext(OrderContext);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    const handleDetailsOpen = () => setOpenDetails(true)
    const handleDetailsClose = () => setOpenDetails(false)

    console.log('OR OR OR DER DER DER', orders)

    useEffect(() => {
        // Filter only pending orders
        // add logic, if purchase status pending and payment status pending (cod, cop) display confirm order
        const filtered = orders.filter(o => {
            if (o.isActive) {
                if (o.paymentMethod === 'gcash' || o.paymentMethod === 'card') {
                    setIsOnline(true)
                    return o.paymentStatus?.toLowerCase() === "paid" &&
                        o.purchaseStatus?.toLowerCase() === "confirmed"
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
                <Typography variant="body1" color="initial">HILU</Typography>
                <Stack>
                    {pendingOrders.map(order => 
                        <Stack key={order._id}>
                            <Typography variant="body1" color="initial">{order.userId?.fullName}</Typography>
                            <Typography variant="body1" color="initial">{order.userId?.email}</Typography>
                        </Stack>
                    )}
                </Stack>
                <Button variant="outlined" onClick={handleDetailsOpen}>
                    hilu
                </Button>
            </Container>
            <OrderDetailsDrawer open={openDetails} onClose={handleDetailsClose}/>
        </>
	);
}
