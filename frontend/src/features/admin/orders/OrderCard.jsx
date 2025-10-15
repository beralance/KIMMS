import React, { useState } from 'react'
import {} from '@mui/icons-material'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import {ArrowRightIcon} from 'lucide-react'

const statusMessage = [
    { id: 0, color: '#FF6F00', message: 'Order is awaiting confirmation', status: 'pending' },
    { id: 1, color: '#FFB300', message: 'Order has been confirmed and is waiting to be processed', status: 'confirmed' },
    { id: 2, color: '#FBC02D', message: 'Order is currently being prepared for shipment', status: 'processing' },
    { id: 3, color: '#7CB342', message: 'Order has been shipped and is in transit to the customer', status: 'out_for_delivery' },
    { id: 4, color: '#388E3C', message: 'Order has been delivered successfully', status: 'delivered' },
];


const OrderCard = ({orderData}) => {
    const [openDetails, setOpenDetails] = useState(false);
    const handleDetailsOpen = () => setOpenDetails(true)
    const handleDetailsClose = () => setOpenDetails(false)

    return (
        <>
            <Box >
                <Stack sx={{bgcolor: '#f0f0f0', p: 1, borderRadius: 2}}>
                    <Stack direction={'row'} gap={2} sx={{position: 'relative'}}>
                        <Stack alignItems={'center'} sx={{position: 'relative'}}>
                            <img 
                                src={orderData.userId.avatar}
                                style={{
                                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
                                    width: '50px',
                                    height: '50px',
                                    display: 'block',
                                    objectFit: 'cover',
                                    borderRadius: '999px',
                                }}
                            />
                            <Box sx={{position: 'absolute', bottom: -12, backdropFilter: 'blur(10px)', bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: '999px', px: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)'}}>
                                <Typography variant="body2" color="white">{orderData.paymentStatus}</Typography>
                            </Box>
                        </Stack>
                        <Stack sx={{width: '100%'}}>
                            <Typography variant="body1" color="secondary" sx={{maxWidth: '70%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{orderData.userId?.fullName}</Typography>
                            <Typography variant="body2" color="secondary" noWrap sx={{whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{orderData.userId?.email}</Typography>
                        </Stack>
                        <Box sx={{position: 'absolute', top: 0, right: 2,}}>
                            <IconButton sx={{bgcolor: '#f0f0f0'}} onClick={handleDetailsOpen}>
                                <ArrowRightIcon/>
                            </IconButton>
                        </Box>
                    </Stack>
                    <Divider sx={{my: 2}}/>
                    <Stack>
                        <Stack p={1} sx={{borderRadius: 1, mb: 1}}>
                            <Stack direction={'row'} gap={1}> 
                                <Typography variant="body2" color="secondary" fontWeight={'bold'}>Status: </Typography>
                                <Typography variant="body2" color="secondary">{orderData.purchaseStatus}</Typography>
                            </Stack>
                            <Stack direction={'row'} gap={1}> 
                                <Typography variant="body2" color="secondary" fontWeight={'bold'}>Payment method: </Typography>
                                <Typography variant="body2" color="secondary">{orderData.paymentMethod}</Typography>
                            </Stack>
                            <Stack direction={'row'} gap={1}> 
                                <Typography variant="body2" color="secondary" fontWeight={'bold'}>Total Products: </Typography>
                                <Typography variant="body2" color="secondary">{orderData.products.length}</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">{dayjs(orderData.createdAt).format('MMMM D, YYYY')}</Typography>
                            <Typography variant="body2" color="secondary">{dayjs(orderData.createdAt).format('h:mm A')}</Typography>
                        </Stack>
                    </Stack>
                    <Divider sx={{my: 1}}/>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        {statusMessage.filter(message => message.status === orderData.purchaseStatus).map(message => (
                            <Box key={message.id}>
                                <Typography variant="body2" color={message.color} sx={{maxWidth: '200%'}}>{message.message}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </Box>
            <OrderDetailsDrawer open={openDetails} onClose={handleDetailsClose} orderData={orderData}/>
        </>
    )
}

export default OrderCard
