import React, { useEffect, useState } from 'react'
import { FlightTakeoffSharp } from '@mui/icons-material'
import { Box, Collapse, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import dayjs from 'dayjs'
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import {ArrowRightIcon, ChevronDownIcon, CopyCheckIcon, CopyIcon} from 'lucide-react'
import SectionWrapper from '../../../components/SectionWrapper';

const OrderCard = ({orderData, openDrawer = false, onOpen, onClose}) => {
    const [openDetails, setOpenDetails] = useState(false);
    const [openProductPreview, setOpenProductPreview] = useState(false)
    const [copied, setCopied] = useState(false)


    useEffect(() => {
        if (openDrawer) {
            setOpenDetails(true)
        }
        else {
            setOpenDetails(false)
        }
    }, [openDrawer])

    const handleDetailsOpen = () => {
        setOpenDetails(true)
        onOpen?.()
    }

    const handleDetailsClose = () => {
        setOpenDetails(false)
        onClose?.()
    }
    
    return (
        <>
            <Box >
                <SectionWrapper>
                    <Stack sx={{borderRadius: 2}}>
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
                            <Stack sx={{width: '100%', overflow: 'hidden'}}>
                                <Typography variant="body1" color="secondary" sx={{maxWidth: '70%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{orderData.userId?.fullName}</Typography>
                                <Typography variant="body2" color="secondary" noWrap>{orderData.userId?.email}</Typography>
                            </Stack>
                            <Box sx={{position: 'absolute', top: -5, right: 2,}}>
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
                            <Stack>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Typography variant="body2" color="secondary">View Products</Typography>
                                    <IconButton onClick={() => setOpenProductPreview((prev) => !prev)}>
                                        <ChevronDownIcon/>
                                    </IconButton>
                                </Stack>
                                <Collapse in={openProductPreview}>
                                    <Stack gap={2} sx={{p: 1}}>
                                        {(Array.isArray(orderData.products) ? orderData.products : [orderData.products]).map((product) => (
                                            <Box key={product._id}>
                                                <Stack direction={'row'} alignItems={'center'} gap={2}>
                                                    <Box sx={{height: 50, width: 50}}>
                                                        <img src={product.productId?.images[0]} style={{display: 'block', width: '100%', height: '100%', borderRadius: '2px', aspectRatio: '1/1'}}/>
                                                    </Box>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="secondary"
                                                        noWrap
                                                        sx={{
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {product.productId?.productName}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Collapse>
                            </Stack>
                        </Stack>
                        <Divider sx={{my: 1}}/>
                        <Stack>
                            
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body2" color="initial">
                                    {orderData.orderId || ''}
                                </Typography>
                                <Tooltip title='Copy Order ID'>
                                        <IconButton 
                                            size='small' 
                                            onClick={() => {
                                                navigator.clipboard.writeText(orderData.orderId || '');
                                                setCopied(true);
                                                setTimeout(() => {
                                                    setCopied(false)
                                                }, 2000);
                                            }}
                                        >
                                            {copied ? <CopyCheckIcon style={{color: 'green'}}/> : <CopyIcon/>}
                                        </IconButton>
                                </Tooltip>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body2" color="secondary">{dayjs(orderData.createdAt).format('MMMM D, YYYY')}</Typography>
                                <Typography variant="body2" color="secondary">{dayjs(orderData.createdAt).format('h:mm A')}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </SectionWrapper>
            </Box>
            <OrderDetailsDrawer open={openDetails} onClose={handleDetailsClose} orderData={orderData}/>
        </>
    )
}

export default OrderCard
