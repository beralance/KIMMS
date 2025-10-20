// UserOrderTabs.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import OrderContainer from './OrderContainer';
import {} from 'lucide-react'

const statuses = [
    { key: 0, status: 'pending', label: 'Pending', icon: ''},
    { key: 1, status: 'confirmed', label: 'Confirmed' },
    { key: 2, status: 'processing', label: 'Processing' },
    { key: 3, status: 'out_for_delivery', label: 'Out for delivery' },
    { key: 4, status: 'delivered', label: 'Delivered' },
    { key: 5, status: 'cancelled', label: 'Cancelled' },
];

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ p: 2 }}>{children}</Box>}</div>;
}

const OrderTab = ({ orders = [] }) => {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (e, newValue) => setValue(newValue);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Tabs
                orientation={isMediumScreen ? 'horizontal' : 'vertical'}
                value={value}
                onChange={handleChange}
                variant="scrollable"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {statuses.map((status) => (
                    <Tab key={status.key} label={status.label} />
                ))}
            </Tabs>

            {statuses.map((status, index) => {
                const filteredOrders = orders.filter(
                    (o) => o.purchaseStatus?.toLowerCase() === status.status.toLowerCase()
                );

                return (
                    <TabPanel key={status.key} value={value} index={index}>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <Box key={order._id} sx={{ mb: 2 }}>
                                    <OrderContainer order={order} />
                                </Box>
                            ))
                        ) : (
                            <Stack justifyContent="center" alignItems="center" height="40vh">
                                <Typography>You don't have orders yet</Typography>
                                <Typography>Click the button below to browse our products</Typography>
                            </Stack>
                        )}
                    </TabPanel>
                );
            })}
        </Box>
    );
};

export default OrderTab;
