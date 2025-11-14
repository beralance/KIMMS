// src/components/Orders.jsx (or PendingOrders.jsx if you keep that name)
import React, { useContext, useEffect, useMemo, useState } from "react";
import {FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import FullScreenLoader from "../../../components/FullScreenLoader";
import OrderTab from "./OrderTab";


export default function OrderList({selectedOrder, orderData}) {
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('newest');

    const filteredOrders = useMemo(() => {
        let orders = [...(orderData || [])]

        if (typeFilter !== 'all') {
            orders = orders.filter((o) => o.orderType === typeFilter)
        }

        orderData.sort((a, b) => {
            return dateFilter === 'newest'
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
        })

        return orders
    }, [orderData, typeFilter, dateFilter])

	return (
        <>
            <Stack>
                <OrderTab dateFilter={dateFilter} typeFilter={typeFilter} setDateFilter={setDateFilter} setTypeFilter={setTypeFilter} orderData={filteredOrders} selectedOrder={selectedOrder}/>
            </Stack>
        </>
	);
}
