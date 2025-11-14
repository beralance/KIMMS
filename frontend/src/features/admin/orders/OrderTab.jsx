import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OrderCard from "./OrderCard";
import { Divider, FormControl, InputLabel, MenuItem, Select, Stack, useMediaQuery, useTheme } from '@mui/material';
import OrderPagination from "./OrderPagination";
import { toTitleCase } from '../../../utils/stringUtils';
import FullScreenLoader from '../../../components/FullScreenLoader'
import { BlocksIcon } from 'lucide-react';

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
                <Box>
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

export default function OrderTab({orderData = [], setDateFilter, typeFilter, dateFilter, setTypeFilter, itemsPerPage=5, selectedOrder}) {
    const [value, setValue] = React.useState(0);
    const [tabPage, setTabPage] = React.useState({})
    const [openOrderId, setOpenOrderId] = React.useState(null)
    const [loading, setLoading] = React.useState(false)

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

    // used for SEARCH TERM
    React.useEffect(() => {
        if (selectedOrder && orderData?.length > 0) {
            console.log('TRIGGERED!!!!!!!!!!!!!')
            const targetStatus = selectedOrder.purchaseStatus?.toLowerCase()

            const matchedTab = statuses.findIndex(
                (s) => s.status.toLowerCase() === targetStatus
            )

            if (matchedTab !== -1) {
                setValue(matchedTab)
            }

            setTimeout(() => {
                setOpenOrderId(selectedOrder.id)
            }, 300);
        }
    }, [selectedOrder])


   

    React.useEffect(() => {
        setOpenOrderId(null)
    }, [value])

    return (
        <Box>
            <Stack direction={{xs: 'column', md: 'row'}}>
                <Tabs
                    orientation={isMediumScreen ? 'horizontal' : 'vertical'}
                    variant='scrollable'
                    value={value}
                    onChange={handleChange}
                    TabIndicatorProps={{
                        sx: {
                            height: '100%',
                            borderRadius: '999px',
                            bgcolor: 'secondary.main',
                        }
                    }}
                    sx={{ 
                        borderRight: 1, 
                        borderColor: 'divider',
                        overflow: 'hidden',
                    }}
                >
                    {statuses.map((status, index) => (
                        <Tab 
                            key={status.key} 
                            label={toTitleCase(`${status.label}`)} 
                            sx={{
                                zIndex: 1,
                                "&.Mui-selected": { color: "white", fontWeight: 'bold'}
                            }}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
                
                <Divider sx={{my: 2}}/>
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
                            <Stack gap={2}>
                                <Stack>
                                    <Stack gap={2} my={2} direction={'row'} alignItems={'center'} flexWrap={'wrap'} justifyContent={'space-between'}>
                                        <Box>
                                            <Typography variant="body1" color="gray" fontWeight={'bold'} sx={{borderRadius: 2, px: 1, px: 2, alignItems: 'center', display: 'flex', gap: 1}}>
                                                <BlocksIcon/>
                                                {`Order${filteredOrders.length > 1 ? 's' : ''} ${filteredOrders.length}`}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={2}>
                                            <FormControl size="small" sx={{ minWidth: 100 }}>
                                                <InputLabel>Order Type</InputLabel>
                                                <Select
                                                    value={typeFilter}
                                                    label="Order Type"
                                                    onChange={(e) => setTypeFilter(e.target.value)}
                                                >
                                                    <MenuItem value="all"><Typography variant="body2" color="secondary">All</Typography></MenuItem>
                                                    <MenuItem value="fixed"><Typography variant="body2" color="secondary">Fixed</Typography></MenuItem>
                                                    <MenuItem value="auction"><Typography variant="body2" color="secondary">Auction</Typography></MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl size="small" sx={{ minWidth: 100 }}>
                                                <InputLabel>Sort by Date</InputLabel>
                                                <Select
                                                    value={dateFilter}
                                                    label="Sort by Date"
                                                    onChange={(e) => setDateFilter(e.target.value)}
                                                >
                                                    <MenuItem value="newest"><Typography variant="body2" color="secondary">Newest</Typography></MenuItem>
                                                    <MenuItem value="oldest"><Typography variant="body2" color="secondary">Oldest</Typography></MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    </Stack>

                                    <Stack gap={2}>
                                        {currentOrders.map((order) => (
                                            <Box key={order._id}>
                                                <OrderCard 
                                                    orderData={order} 
                                                    op={openOrderId}
                                                    openDrawer={openOrderId === order._id} 
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Stack>

                                {currentOrders.length > 0 ? (
                                    <>
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
                                        <Typography>No orders with <span>{toTitleCase(status.status.replace(/_/g, ' '))}</span> status</Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </TabPanel>
                    )
                })}
            </Stack>
            <FullScreenLoader open={loading}/>
        </Box>
    );
}
