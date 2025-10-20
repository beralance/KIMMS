// src/components/Orders.jsx (or PendingOrders.jsx if you keep that name)
import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Container, Stack} from "@mui/material";
import { OrderContext } from "../../../contexts/OrderContext";
import { formatNumber, toTitleCase } from "../../../utils/stringUtils";
import FullScreenLoader from "../../../components/FullScreenLoader";
import OrderTab from "./OrderTab";

const statusOptions = ["Pending", "Confirmed", "Processing", "Out for Delivery", "Deliver", "Cancel"];

export default function OrdersTable({selectedOrder}) {
    const { orders, updateOrderStatus } = useContext(OrderContext);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [loading, setLoading] = useState(false)
    

    useEffect(() => {
        // add logic, if purchase status pending and payment status pending (cod, cop) display confirm order
        const filtered = orders.filter(o => {
            setLoading(true)
            try {
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
            }
            catch (err) {
                console.error(err)
            }
            finally {
                setLoading(false)
            }
        });
        setPendingOrders(filtered);
        console.log('THIS IS PENDING ORDER', pendingOrders)

    }, [orders]);

	return (
        <>
            <Container>
                <Typography variant="body1" color="initial" sx={{py: 2}}>Order List</Typography>
                <Stack>
                    <Stack gap={2} sx={{mb: 2}}>
                        <OrderTab orderData={pendingOrders} selectedOrder={selectedOrder}/>
                    </Stack>
                </Stack>
            </Container>
            <FullScreenLoader open={loading}/>
        </>
	);
}
