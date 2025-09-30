// src/components/Orders.jsx (or PendingOrders.jsx if you keep that name)
import React, { useContext, useEffect, useState } from "react";
import {
  Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { OrderContext } from "../../../contexts/OrderContext";

const statusOptions = ["Pending", "Confirmed", "Processing", "Out for Delivery", "Delivered", "Cancelled"];

function Row({ row, onUpdateStatus }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.userId.fullName}</TableCell>
                <TableCell>{row.userId.email}</TableCell>
                <TableCell>{row.totalPrice}</TableCell>
                <TableCell>{row.purchaseStatus}</TableCell>
                <TableCell>{row.paymentStatus}</TableCell>
            </TableRow>

        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Products
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.products.map(item => (
                                    <TableRow key={item.productId._id}>
                                        <TableCell>
                                            <img
                                                src={`${item.productId?.images[0]}`}
                                                alt={item.productId.productName}
                                                width="50"
                                            />
                                        </TableCell>
                                        <TableCell>{item.productId.productName}</TableCell>
                                        <TableCell>${item.productId.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Status update buttons */}
                        <Box sx={{ marginTop: 2 }}>
                            {statusOptions
                            .filter(status => status.toLowerCase() !== row.purchaseStatus.toLowerCase())
                            .map(status => (
                                <Button
                                    key={status}
                                    variant="contained"
                                    color={
                                        status === "Cancelled" ? "error" :
                                        status === "Delivered" ? "success" :
                                        "primary"
                                    }
                                    sx={{ marginRight: 1, marginTop: 1 }}
                                    onClick={() =>
                                        onUpdateStatus(row._id, status.toLowerCase().replace(/ /g, "_"))
                                    }
                                >
                                    {status}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
        </>
    );
}

export default function OrdersTable() {
    const { orders, updateOrderStatus } = useContext(OrderContext);
    const [pendingOrders, setPendingOrders] = useState([]);

    useEffect(() => {
        // Filter only pending orders
        const filtered = orders.filter(
        o =>
            o.paymentStatus?.toLowerCase() === "paid" &&
            o.purchaseStatus?.toLowerCase() === "pending"
        );
        setPendingOrders(filtered);
    }, [orders]);

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
		<TableContainer component={Paper}>
            <Table aria-label="pending orders table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Customer</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Purchase Status</TableCell>
                        <TableCell>Payment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pendingOrders.map(order => (
                        <Row key={order._id} row={order} onUpdateStatus={handleUpdateStatus} />
                    ))}
                </TableBody>
            </Table>
		</TableContainer>
	);
}
