// UserOrderTabs.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Stack, Typography, useMediaQuery, useTheme, Divider } from '@mui/material';
import OrderContainer from './OrderContainer';
import { CheckCheckIcon, CircleEllipsisIcon, PackageCheckIcon, PackageOpenIcon, PackageXIcon, TruckIcon } from 'lucide-react'
import SectionWrapper from '../../../components/SectionWrapper';

const statuses = [
    { key: 0, status: 'pending', label: 'Pending', icon: <CircleEllipsisIcon/>},
    { key: 1, status: 'confirmed', label: 'Confirmed',  icon: <CheckCheckIcon/>},
    { key: 2, status: 'processing', label: 'Processing', icon: <PackageOpenIcon/> },
    { key: 3, status: 'out_for_delivery', label: 'Out for delivery', icon: <TruckIcon/> },
    { key: 4, status: 'delivered', label: 'Delivered', icon: <PackageCheckIcon/> },
    { key: 5, status: 'cancelled', label: 'Cancelled', icon: <PackageXIcon/> },
];

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box>{children}</Box>}</div>;
}

const OrderTab = ({ orders = [] }) => {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (e, newValue) => setValue(newValue);

    return (
        <Stack gap={2}>
            <SectionWrapper>

                <Tabs
                    orientation={isMediumScreen ? 'horizontal' : 'vertical'}
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    TabIndicatorProps={{
                        sx: {
                            height: '20px',
                            borderRadius: '999px',
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 1.5,
                            bgcolor: '#3b3b3bff'
                        }
                    }}
                    sx={{ borderRight: 1, color: 'white', borderColor: 'divider' }}
                >
                    {statuses.map((status) => (
                        <Tab 
                            key={status.key} 
                            label={status.label}
                            icon={status.icon}
                            sx={{
                                color: status.key === status.key ? 'gray' : 'black',
                                zIndex: 10,
                                "&.Mui-selected": { color: "white", fontWeight: 'bold'}
                            }}
                        />
                    ))}
                </Tabs>
                <Divider sx={{my: 2}}/>
                <Box>
                    {statuses.map((status, index) => {
                        const filteredOrders = orders.filter(
                            (o) => o.purchaseStatus?.toLowerCase() === status.status.toLowerCase()
                        );

                        return (
                            <TabPanel key={status.key} value={value} index={index}>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <Box key={order._id} p={0}>
                                            <OrderContainer order={order} />
                                        </Box>
                                    ))
                                ) : (
                                    <Stack alignItems={'center'} gap={1} justifyContent={'center'} height={'40vh'}>
                                        <Box>
                                            <img 
                                                src="/shocked-shock.svg"
                                                style={{
                                                    display: 'block',
                                                    width: '70px',
                                                    height: '70px',
                                                    opacity: '0.8'
                                                }} 
                                            />
                                        </Box>
                                        <Stack>
                                            <Typography variant='subtitle1' color='secondary' align='center'>You don't have <b>{status.label}</b> orders yet.</Typography>
                                            <Typography variant='body2' color='gray' align='center'> Click the button below to browse our products</Typography>
                                        </Stack>
                                    </Stack>
                                )}
                            </TabPanel>
                        );
                    })}
                </Box>
            </SectionWrapper>
        </Stack>
    );
};

export default OrderTab;
