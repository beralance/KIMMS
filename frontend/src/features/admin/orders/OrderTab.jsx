import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OrderCard from "./OrderCard";
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import OrderPagination from "./OrderPagination";
import { toTitleCase } from '../../../utils/stringUtils';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const statuses = [
    {key: 0, status: 'pending', label: 'Pending'},
    {key: 1, status: 'confirmed', label: 'Confirmed'},
    {key: 2, status: 'processing', label: 'Processing'},
    {key: 3, status: 'out_for_delivery', label: 'In Transit'},
    {key: 4, status: 'delivered', label: 'Delivered'},
    {key: 5, status: 'cancelled', label: 'Cancelled'},
]

export default function OrderTab({orderData = [], itemsPerPage=5, selectedOrder}) {
    const [value, setValue] = React.useState(0);
    const [tabPage, setTabPage] = React.useState({})
    const [openOrderId, setOpenOrderId] = React.useState(null)

    const theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setTabPage((prev) => ({...prev, [newValue]: 1}))
    };

    const handlePageChangeForTab = (tabIndex, page) => {
        setTabPage((prev) => ({ ...prev, [tabIndex]: page }));
        onPageChange(page);
        scrollToTop();
    };

    React.useEffect(() => {
        if (selectedOrder && orderData?.length > 0) {
            const targetStatus = selectedOrder.purchaseStatus?.toLowerCase()

            const matchedTab = statuses.findIndex(
                (s) => s.status.toLowerCase() === targetStatus
            )

            if (matchedTab !== -1) {
                setValue(matchedTab)
            }

            setTimeout(() => {
                setOpenOrderId(selectedOrder._id)
            }, 300);
        }
    }, [selectedOrder, orderData])

    const handleOpenDrawer = (orderId) => {
        setOpenOrderId(orderId)
    }

    const handleCloseDrawer = () => {
        setOpenOrderId(null)
    }

    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', height: 224 }}
        >
            <Stack direction={{xs: 'column', md: 'row'}}>
                <Tabs
                    orientation={isMediumScreen ? 'horizontal' : 'vertical'}
                    variant='scrollable'
                    value={value}
                    onChange={handleChange}
                    sx={{ 
                        borderRight: 1, 
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}
                >
                    {statuses.map((status, index) => (
                        <Tab 
                            key={status.key} 
                            label={toTitleCase(`${status.label}`)} 
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
                
                {statuses.map((status, index) => {
                    const filteredOrders = orderData.filter(
                        (o) => o.purchaseStatus?.toLowerCase() === status.status.toLowerCase()
                    )

                    const page = tabPage[index] || 1
                    const indexOfLast = page * itemsPerPage;
                    const indexOfFirst = indexOfLast - itemsPerPage;
                    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
                    const totalPage = Math.ceil(filteredOrders.length / itemsPerPage)
                    
                    return (
                        <TabPanel key={index} value={value} index={index}>
                            <Box>
                                <Typography variant="body1" color="initial">
                                    TOTAL {filteredOrders.length}
                                </Typography>
                                {currentOrders.length > 0 ? (
                                    <>
                                        {currentOrders.map((order) => (
                                            <Box key={order._id} sx={{mb: 5}}>
                                                <OrderCard 
                                                    orderData={order} 
                                                    openDrawer={openOrderId === order._id} 
                                                    onOpen={() => handleOpenDrawer(order._id)} 
                                                    onClose={handleCloseDrawer}
                                                />
                                            </Box>
                                        ))}
                                        {totalPage > 1 && (
                                            <OrderPagination
                                                count={totalPage}
                                                page={page}
                                                onChange={(e, value) => handlePageChangeForTab(index, value)}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <Stack justifyContent={'center'} alignItems={'center'} height={'40vh'}>
                                        <img src='/smileys-sleep.svg' style={{width: '70px', height: '70px', opacity: '0.8', aspectRatio: '1/1', display: 'block'}}/>
                                        <Typography>No orders with '{status.status}' status</Typography>
                                    </Stack>
                                )}
                            </Box>
                        </TabPanel>
                    )
                })}
            </Stack>
        </Box>
    );
}
