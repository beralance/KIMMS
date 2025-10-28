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
                const filtered = orders.filter(o => {
                    if (o.isActive && o.orderType === 'fixed') {
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
            finally {
                setLoading(false)
            }
        });

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
